"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { normalizeTrackingNumber } from "@/lib/tracking";

export function TrackingLookup({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeTrackingNumber(trackingNumber);
    if (!normalized) return;
    router.push(`/tracking/${encodeURIComponent(normalized)}`);
  }

  return (
    <div className={compact ? "" : "rounded-lg bg-white p-5 shadow-2xl shadow-slate-950/20"}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="tracking-number">Tracking number</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            id="tracking-number"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Enter tracking number"
            required
            className="h-13 w-full rounded-md border border-slate-300 bg-white pl-11 pr-4 text-slate-950 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/12"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-13 items-center justify-center gap-2 rounded-md bg-orange-600 px-6 font-bold text-white transition hover:bg-orange-700"
        >
          <ArrowRight size={18} />
          Track
        </button>
      </form>
    </div>
  );
}
