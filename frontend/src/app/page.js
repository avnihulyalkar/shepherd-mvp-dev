'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSignMessage,
} from 'wagmi';
import { getAddress } from 'viem';
import { createSiweMessage } from 'viem/siwe';

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainIdFromHook = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [signing, setSigning] = useState(false);

  const portoConnector =
    connectors.find((c) => c.id === 'xyz.ithaca.porto') ?? connectors[0];

  // If already authenticated (server session set), go to /dashboard
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/me', {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (r.ok) router.replace('/dashboard');
      } catch {}
    })();
  }, [router]);

  async function handleSignIn() {
    if (signing) return; // prevent double-click nonce races
    setSigning(true);
    try {
      // 1) Connect wallet and capture address/chain
      let acct = address;
      let activeChainId = chainIdFromHook;

      if (!acct) {
        if (!portoConnector) throw new Error('Porto connector not available');
        const conn = await connectAsync({ connector: portoConnector });
        acct = conn.account || conn.accounts?.[0];
        activeChainId = conn.chain?.id ?? activeChainId;
      }
      if (!acct || !acct.startsWith('0x') || acct.length !== 42) {
        throw new Error('No valid wallet address from connector');
      }

      // Ensure EIP-55 checksum (throws if invalid)
      acct = getAddress(acct);

      // If chainId is still unknown, query provider
      if (!activeChainId) {
        try {
          const provider = await portoConnector?.getProvider?.();
          const chainIdHex = await provider?.request?.({ method: 'eth_chainId' });
          if (chainIdHex) activeChainId = parseInt(chainIdHex, 16);
        } catch {}
      }
      if (!activeChainId) activeChainId = 84532; // Base Sepolia fallback

      // 2) Get nonce (sets httpOnly siwe_nonce cookie)
      const nonceRes = await fetch('/api/siwe/nonce', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (!nonceRes.ok) throw new Error('Failed to fetch nonce');
      const { nonce } = await nonceRes.json();

      // 3) Build SIWE message string with viem (avoids siwe constructor parser issues)
      const statement = 'Sign in with Ethereum to this app.';
      const message = createSiweMessage({
        address: acct,
        chainId: activeChainId,
        domain: window.location.hostname, // hostname only (no scheme/port)
        nonce,
        uri: window.location.origin,
        version: '1',
        statement: statement.replace(/[\r\n]+/g, ' '), // single-line
      });

      // 4) Sign & verify (server sets httpOnly session cookie)
      const signature = await signMessageAsync({ message });
      const verifyRes = await fetch('/api/siwe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) {
        let detail = 'Failed to verify';
        try {
          const err = await verifyRes.json();
          detail = `${err.error}${err.detail ? `: ${err.detail}` : ''}`;
          console.error('[SIWE verify error]', err);
        } catch {}
        throw new Error(detail);
      }

      // 5) Go to dashboard
      router.replace('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Sign-in failed');
    } finally {
      setSigning(false);
    }
  }

  return (
    <div className="bg-black h-full flex flex-col items-center justify-center gap-4">
      <button
        onClick={handleSignIn}
        disabled={isPending || !portoConnector || signing}
        className="bg-[#df153e] rounded-full py-4 px-8 disabled:opacity-60"
      >
        {isPending || signing ? 'Connecting…' : 'Sign in with Porto'}
      </button>

      {isConnected && (
        <button
          onClick={async () => {
            try {
              await fetch('/api/siwe/logout', {
                method: 'POST',
                credentials: 'same-origin',
              });
            } catch {}
            disconnect();
          }}
          className="text-sm text-gray-300 underline"
        >
          Disconnect
        </button>
      )}
    </div>
  );
}
