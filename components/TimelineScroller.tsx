"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SPEED = 18; // px por segundo: bem devagar
const END_PAUSE = 2500; // ms parado no fim antes de voltar ao começo

/**
 * Faixa da linha do tempo que anda sozinha, devagar, para a direita, sem barra de
 * rolagem. Para quando o mouse está em cima ou alguém toca/rola; no fim, espera e
 * volta suave ao começo. Com movimento reduzido, fica parada (dá para rolar).
 */
export default function TimelineScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    let x = el.scrollLeft; // posição com fração: scrollLeft sozinho arredonda e trava devagar
    let last = performance.now();
    let waitUntil = 0;
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const max = el.scrollWidth - el.clientWidth;
      if (paused || now < waitUntil) {
        x = el.scrollLeft; // segue o que a pessoa rolou
      } else if (x >= max - 1) {
        waitUntil = now + END_PAUSE;
        setTimeout(() => {
          el.scrollTo({ left: 0, behavior: "smooth" });
        }, END_PAUSE - 1200);
      } else {
        x += SPEED * dt;
        el.scrollLeft = x;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const pause = () => (paused = true);
    const resume = () => (paused = false);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
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
