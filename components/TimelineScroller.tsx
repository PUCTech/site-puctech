"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Linha do tempo inteira na tela: no desktop ela usa a largura da janela e, se não
 * couber, encolhe por igual (scale) até caber. No celular, rola para os lados.
 */
export default function TimelineScroller({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const measure = () => {
      if (!window.matchMedia("(min-width: 768px)").matches) return setFit(null);
      const scale = Math.min(1, outer.clientWidth / inner.scrollWidth);
      setFit({ scale, height: inner.offsetHeight * scale });
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(outer);
    return () => resize.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className={fit ? "overflow-hidden" : "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
      style={fit ? { height: fit.height } : undefined}
    >
      <div
        ref={innerRef}
        className="w-max origin-top-left"
        style={fit ? { transform: `scale(${fit.scale})` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
