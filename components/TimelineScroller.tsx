"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Faixa da linha do tempo em parallax: conforme a página rola para baixo, ela anda
 * para o lado, do começo (2024) ao fim, sem barra de rolagem. O movimento segue a
 * rolagem com um pouco de atraso, para ficar macio. Com movimento reduzido, fica
 * parada e dá para rolar com a mão.
 */
export default function TimelineScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = el.scrollLeft; // posição atual, com fração (scrollLeft sozinho arredonda)
    let frame = 0;

    const tick = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Começa quando o topo da faixa passa de 85% da tela e chega ao fim quando ele
      // alcança 15%: a faixa inteira passa enquanto ela ainda está toda à vista.
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.7)));
      const target = progress * (el.scrollWidth - el.clientWidth);
      x += (target - x) * 0.14; // aproxima aos poucos: o atraso dá a sensação de parallax
      if (Math.abs(target - x) > 0.1) el.scrollLeft = x;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={0}
      aria-label="Linha do tempo (role para os lados)"
      className="overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,#000_4rem,#000_calc(100%-4rem),transparent)] [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  );
}
