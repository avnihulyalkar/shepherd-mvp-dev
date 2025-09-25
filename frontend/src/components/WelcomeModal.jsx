import { useEffect, useState, useCallback } from "react";

export default function WelcomeModal() {
  const [showModal, setShowModal] = useState(true);

  // close on Esc
  const onKeyDown = useCallback((e) => {
    if (e.key === "Escape") setShowModal(false);
  }, []);

  useEffect(() => {
    if (!showModal) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal, onKeyDown]);

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg rounded-xl border border-gray-border bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-200">
            <span className="text-primary">
              Shepherd is an AI-driven security engine that validates and
              reproduces smart contract exploits.
            </span>{" "}
            Our goal is to give auditors and developers a security copilot that
            automates setup, execution, and proof of vulnerabilities that
            normally take hours of manual work.
          </p>
          <p className="text-sm text-gray-200">
            <span className="text-primary">Shepherd Alpha</span> is a guided
            demo of that system. In this release, Shepherd:
          </p>
          <ul className="list-disc text-sm text-gray-200 pl-6">
            <li>
              Spins up an environment for smart contract repos with clean
              deployment pipelines (e.g., Damn Vulnerable DeFi, NFT/token
              examples)
            </li>
            <li>Orchestrates attack paths based on known exploit classes</li>
            <li>
              Produces reproducible exploit transcripts auditors can use as PoCs
            </li>
          </ul>
          <p className="text-sm text-gray-200">
            Auditors today rely on slow manual processes or static tools that
            can flag issues but can't execute them end-to-end. Shepherd shows
            that multi-agent AI can—spinning up the environment, chaining the
            calls, and proving the exploit in full.
          </p>
          <p className="text-sm text-gray-200">
            Right now, Alpha runs on repos with straightforward initialization.
            Complex protocols like Uniswap or Compound—where deployment and
            state setup are heavier—remain the focus of our upcoming Beta, which
            generalizes Shepherd's orchestration to production-grade protocols.
          </p>
        </div>

        <div className="mt-6 flex justify-center items-center gap-3">
          <button
            type="button"
            className="w-full px-4 py-2 rounded-md border border-gray-border hover:bg-white/5 transition-all"
            onClick={() => setShowModal(false)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
