import { NextResponse } from 'next/server'
import { generateSiweNonce } from 'viem/siwe'

export async function GET() {
    const nonce = generateSiweNonce() // alphanumeric, >= 8 chars
    const isProd =
        process.env.NODE_ENV === 'production' ||
        process.env.VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

    const res = NextResponse.json({ nonce })
    res.cookies.set('siwe_nonce', nonce, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: isProd,   // false on localhost, true on HTTPS
        path: '/',
        maxAge: 300,      // 5 min
    })
    return res
}
