"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const HEADER_PX = 64; // altura do cabeçalho fixo do site

/**
 * Linha do tempo com rolagem "presa": quando ela chega ao meio da tela, a página
 * para de subir e a rolagem passa a mover a linha para o lado, do começo ao fim.
 * Terminado o trajeto, a página volta a rolar normalmente. Com movimento reduzido,
 * é só uma faixa que rola para os lados com a mão.
 */
export default function TimelineScroller({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Quanto a linha anda para o lado (px) e onde ela fica presa na tela.
  const [pin, setPin] = useState<{ distance: number; top: number; height: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;

    const measure = () => {
      const distance = Math.max(0, track.scrollWidth - track.clientWidth);
      const top = Math.max(HEADER_PX, (window.innerHeight - sticky.offsetHeight) / 2);
      setPin({ distance, top, height: sticky.offsetHeight });
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!pin || !outer || !track) return;
    let frame = 0;
    const tick = () => {
      // Quanto já se rolou desde que a linha ficou presa, de 0 até a distância toda.
      const scrolled = pin.top - outer.getBoundingClientRect().top;
      track.scrollLeft = Math.min(pin.distance, Math.max(0, scrolled));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pin]);

  return (
    // A altura extra é o "trilho" de rolagem: cada px rolado vira 1px para o lado.
    <div ref={outerRef} style={pin ? { height: pin.height + pin.distance } : undefined}>
      <div ref={stickyRef} className="sticky" style={pin ? { top: pin.top } : undefined}>
        <div
          ref={trackRef}
          tabIndex={0}
          aria-label="Linha do tempo (role para os lados)"
          className={`overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,#000_4rem,#000_calc(100%-4rem),transparent)] [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden ${
            pin ? "overflow-x-hidden" : "overflow-x-auto"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
