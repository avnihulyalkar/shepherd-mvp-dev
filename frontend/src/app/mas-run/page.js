"use client";
import Diagram from "@/components/Diagram";
import HypothesisManager from "@/components/HypothesisManager";
import { Suspense } from "react";

export default function MasRun() {
  return (
    <div className="container mx-auto py-8 px-4 bg-black h-[calc(100vh-5rem)] max-h-full flex flex-row items-start justify-center gap-8">
      {/* Hypothesis Section */}
      <div className="h-full w-full max-w-3xl flex flex-col">
        <Suspense fallback={<div>Loading hypotheses...</div>}>
          <HypothesisManager />
        </Suspense>
      </div>

      {/* Diagram Section */}
      <div className="rounded-lg border border-gray-border bg-surface h-full w-full max-w-3xl flex flex-col">
        <div className="px-4 py-2 border-b border-gray-border font-semibold text-white bg-[#141414] rounded-t-lg">
          Diagram
        </div>
        <div className="flex-1 flex items-center justify-center text-white bg-surface rounded-b-lg overflow-hidden">
          <Diagram />
        </div>
      </div>
    </div>
  );
}
