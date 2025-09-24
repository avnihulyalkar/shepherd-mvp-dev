import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { getAddress } from 'viem'
import { Porto } from 'porto'
import { RelayClient } from 'porto/viem'
import { parseSiweMessage, verifySiweMessage } from 'viem/siwe'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    function json(status, obj) {
        return NextResponse.json(obj, { status })
    }

    export async function POST(req) {
    try {
        const { message, signature } = await req.json()
        if (!message || !signature) return json(400, { error: 'Missing params' })

        const nonceCookie = cookies().get('siwe_nonce')?.value
        if (!nonceCookie) return json(400, { error: 'Missing nonce cookie' })

        // 1) Parse SIWE (tolerant)
        let parsed
        try {
        parsed = parseSiweMessage(message)
        } catch (e) {
        return json(400, { error: 'Parse failed', detail: String(e?.message || e) })
        }
        const { address, chainId, nonce, domain, uri, version } = parsed

        // 2) Basic sanity checks
        if (version !== '1') return json(400, { error: 'Unsupported SIWE version', version })
        if (nonce !== nonceCookie) return json(401, { error: 'Nonce mismatch' })
        // Optional (but helpful): ensure same origin
        const host = (typeof window === 'undefined' ? undefined : window.location.host) // will be undefined on server
        // In practice, trust the cookie + your app’s origin; domain mismatches are common in dev (ports).
        // If you want, compare domain to req.headers.get('host').

        // 3) Normalize address (throws if invalid)
        let checksumAddr
        try {
        checksumAddr = getAddress(address)
        } catch (e) {
        return json(400, { error: 'Invalid address (EIP-55)', detail: String(e?.message || e) })
        }

        // 4) Verify signature using Porto relay (EOA + EIP-1271 smart accounts)
        const client = RelayClient.fromPorto(Porto.create(), { chainId })
        let ok = false
        try {
        ok = await verifySiweMessage(client, { address: checksumAddr, message, signature })
        } catch (e) {
        return json(400, { error: 'Verification threw', detail: String(e?.message || e) })
        }
        if (!ok) return json(401, { error: 'Invalid signature' })

        // 5) Issue session cookie (sub = your user identifier)
        const token = await new SignJWT({ sub: checksumAddr, chainId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

        const isProd =
        process.env.NODE_ENV === 'production' ||
        process.env.VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

        const res = json(200, { ok: true, address: checksumAddr, chainId, domain, uri })
        res.cookies.set('session', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: isProd,     // false on localhost (HTTP), true on HTTPS
        path: '/',
        maxAge: 60 * 60,
        })
        // clear nonce to prevent replay
        res.cookies.set('siwe_nonce', '', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: isProd,
        path: '/',
        maxAge: 0,
        })
        return res
    } catch (e) {
        return json(400, { error: 'Verify failed (outer catch)', detail: String(e?.message || e) })
    }
}
