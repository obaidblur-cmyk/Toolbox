'use client';
import { useEffect } from 'react';
type W = Window & { adsbygoogle?: unknown[] };
/** Reserves fixed height up front so ads never shift layout (CLS = 0). Renders a labelled placeholder until AdSense env vars are set. */
export default function AdSlot({ slot, height = 280 }: { slot?: string; height?: number }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_ID;
  useEffect(() => {
    if (client && slot) try { const w = window as W; (w.adsbygoogle = w.adsbygoogle || []).push({}); } catch {}
  }, [client, slot]);
  return (
    <aside aria-label="Advertisement" style={{ minHeight: height }} className="my-8 flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-line text-xs text-muted">
      {client && slot
        ? <ins className="adsbygoogle" style={{ display: 'block', width: '100%', minHeight: height }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
        : <span>Advertisement</span>}
    </aside>
  );
}
