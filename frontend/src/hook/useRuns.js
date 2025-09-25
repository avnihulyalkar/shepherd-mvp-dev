import { useEffect, useMemo, useRef } from "react";

export const useRuns = () => {
  const API_BASE = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://shepherd-mas-dev.fly.dev/"
    ).replace(/\/+$/, "");
  }, []);

  const makeRunId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `run-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 10)}`;

  // Only run once: get from localStorage or generate and save
  const getOrCreateRunId = () => {
    if (typeof window === "undefined") {
      return makeRunId();
    }

    const stored = localStorage.getItem("masRunId");
    if (stored) {
      return stored;
    }

    const newId = makeRunId();
    localStorage.setItem("masRunId", newId);
    return newId;
  };

  // Stable run id across re-renders
  const runIdRef = useRef(getOrCreateRunId());
  const runId = runIdRef.current;

  // Publish runId so Diagram (or others) can reuse it
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent("mas:runId", { detail: runId }));
    } catch {}
  }, [runId]);

  // ws(s)://.../ws/{runId}
  const socketUrl = useMemo(() => {
    if (!runId) return null;
    const u = new URL(API_BASE);
    u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
    u.pathname = u.pathname.replace(/\/$/, "") + `/ws/${runId}`;
    return u.toString();
  }, [API_BASE, runId]);

  // Singleton WebSocket connection per URL
  const getSingletonWS = (url) => {
    if (typeof window === "undefined") return new WebSocket(url);
    const pool = (window.__masWsPool ||= new Map());
    const existing = pool.get(url);
    if (existing && existing.readyState < 2) return existing; // 0 CONNECTING, 1 OPEN
    const ws = new WebSocket(url);
    pool.set(url, ws);
    ws.addEventListener("close", () => {
      if (pool.get(url) === ws) pool.delete(url);
    });
    return ws;
  };

  const handleStartRun = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/runs/${runId}`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Failed to start run:", error);
      throw error;
    }
  };

  return {
    API_BASE,
    runId,
    getSingletonWS,
    handleStartRun,
    socketUrl,
  };
};
