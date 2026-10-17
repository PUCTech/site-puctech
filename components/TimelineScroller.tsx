"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Faixa que rola na horizontal para a linha do tempo caber qualquer quantidade de
 * marcos. Abre já no fim (o mais recente) e as bordas somem num degradê.
 */
export default function TimelineScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={0}
      aria-label="Linha do tempo (role para os lados)"
      className="overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,#000_4rem,#000_calc(100%-4rem),transparent)] [scrollbar-width:thin] focus-visible:outline-none"
    >
      {children}
    </div>
  );
}
