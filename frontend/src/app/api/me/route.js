import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
    const cookieStore = await cookies();                // 👈 await
    const token = cookieStore.get('session')?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, secret);
        return NextResponse.json({
        ok: true,
        address: payload.sub,
        chainId: payload.chainId,
        });
    } catch {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
}
