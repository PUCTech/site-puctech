import type { ReactNode } from "react";

/** Faixa da linha do tempo que rola para os lados, sem barra de rolagem e com as bordas apagadas. */
export default function TimelineScroller({ children }: { children: ReactNode }) {
  return (
    <div
      tabIndex={0}
      aria-label="Linha do tempo (role para os lados)"
      className="overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,#000_4rem,#000_calc(100%-4rem),transparent)] [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  );
}
