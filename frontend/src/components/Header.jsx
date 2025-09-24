// /components/Header.jsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '');

export default function Header() {
    const { address: connectedAddress } = useAccount();
    const [session, setSession] = useState(null); // { address, displayName? }

    async function loadSession() {
        try {
        const res = await fetch('/api/me', {
            cache: 'no-store',
            credentials: 'same-origin', // ensure cookies are sent
        });
        if (!res.ok) return setSession(null);
        const data = await res.json(); // { ok, address, displayName? }
        const jsonString = JSON.stringiify(data);
        console.log(jsonString);
        setSession({ address: data.address, displayName: data.displayName });
        } catch {
        setSession(null);
        }
    }

    // initial load
    useEffect(() => { loadSession(); }, []);
    // re-check when wallet connection changes
    useEffect(() => { loadSession(); }, [connectedAddress]);

    const address = session?.address || connectedAddress || null;
    const primary = session?.displayName || (address ? shortAddr(address) : 'Guest');
    const handle  = address ? `@${shortAddr(address)}` : '@anonymous';

    return (
        <div className="w-full h-20 bg-[#0C0C0C] flex items-center justify-between px-20 border-b border-[#353535]">
        <div className="flex flex-row pl-6 gap-x-3">
            <Link href="/">
            <Image src="/shepherd-name.png" height={70} width={140} alt="Shepherd Logo" priority />
            </Link>
        </div>
        <div className="flex flex-row space-x-2 items-center">
            <Image src="/images/pfp.png" height={30} width={30} alt="Profile Picture" />
            <div className="flex flex-col">
            <p className="text-sm">{primary}</p>
            <p className="text-[#8f8f8f] text-sm">{handle}</p>
            </div>
        </div>
        </div>
    );
}
