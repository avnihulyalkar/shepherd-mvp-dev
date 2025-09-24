import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(req) {
    const { pathname } = req.nextUrl
    if (!pathname.startsWith('/dashboard')) return NextResponse.next()

    const token = req.cookies.get('session')?.value
    if (!token) return NextResponse.redirect(new URL('/', req.url))

    try {
        await jwtVerify(token, secret)
        return NextResponse.next()
    } catch {
        return NextResponse.redirect(new URL('/', req.url))
    }
}

export const config = { matcher: ['/dashboard/:path*'] }
