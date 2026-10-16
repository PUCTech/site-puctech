"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/home";

const DURATION = 1600; // ms
const STAGGER = 90; // ms entre um número e o próximo
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// Os números sobem de 0 até o valor quando aparecem na tela, uma vez só.
export default function Stats() {
  const ref = useRef<HTMLDListElement>(null);
  // Começa no valor final: sem JavaScript (ou antes de hidratar) os números já estão certos.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Se já está na tela ao carregar, não anima (evita os números "piscarem" para 0).
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    let frame = 0;
    setProgress(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const total = DURATION + STAGGER * (stats.length - 1);
        const tick = (now: number) => {
          const elapsed = now - start;
          setProgress(Math.min(elapsed / total, 1));
          if (elapsed < total) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const total = DURATION + STAGGER * (stats.length - 1);
  const valueAt = (value: number, index: number) => {
    const t = (progress * total - index * STAGGER) / DURATION;
    return Math.round(value * ease(Math.min(Math.max(t, 0), 1)));
  };

  return (
    <dl
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5"
    >
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex flex-col-reverse justify-end">
          <dt className="mt-1.5 max-w-[20ch] text-[15px] leading-snug text-muted">{stat.label}</dt>
          <dd className="text-4xl font-bold tracking-[-0.03em] tabular-nums md:text-[2.75rem] md:leading-none">
            <span className="sr-only">
              {stat.value}
              {stat.suffix}
            </span>
            <span aria-hidden>
              {valueAt(stat.value, index)}
              <span className="text-accent">{stat.suffix}</span>
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
