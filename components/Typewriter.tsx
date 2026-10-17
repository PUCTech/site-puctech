"use client";

import { useEffect, useRef, useState } from "react";

const SPEED = 22; // ms por letra

/**
 * Digita o texto quando entra na tela, uma vez só. Texto entre **asteriscos**
 * vira negrito, como no withBold. O resto fica invisível no lugar (igual ao
 * ScrambleText), então as linhas não mudam enquanto digita. Sem JavaScript ou
 * com movimento reduzido, o texto aparece inteiro.
 */
export default function Typewriter({ text }: { text: string }) {
  const parts = text.split("**");
  const total = parts.join("").length;
  const ref = useRef<HTMLSpanElement>(null);
  const [typed, setTyped] = useState(total);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const n = Math.min(total, Math.floor((now - start) / SPEED));
          setTyped(n);
          if (n < total) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    setTyped(0);
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [total]);

  // Onde cada parte começa no texto sem os asteriscos.
  const offsets = parts.map((_, i) => parts.slice(0, i).join("").length);
  return (
    <span ref={ref}>
      <span className="sr-only">{parts.join("")}</span>
      <span aria-hidden>
        {parts.map((part, i) => {
          const left = typed - offsets[i];
          const shown = Math.max(0, Math.min(part.length, left));
          const caret = left >= 0 && left < part.length;
          const content = (
            <>
              {part.slice(0, shown)}
              {caret && (
                <span className="relative">
                  <span className="absolute top-[0.1em] left-0 h-[1em] w-[0.08em] animate-pulse bg-current" />
                </span>
              )}
              <span className="invisible">{part.slice(shown)}</span>
            </>
          );
          return i % 2 === 1 ? <strong key={i}>{content}</strong> : <span key={i}>{content}</span>;
        })}
      </span>
    </span>
  );
}
