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

  // O primeiro número (estudantes que passaram pela liga) é o destaque.
  return (
    <dl
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8"
    >
      {stats.map((stat, index) => {
        const lead = index === 0;
        return (
          <div
            key={stat.label}
            className={`flex flex-col-reverse justify-end ${
              // No desktop o destaque ocupa as duas linhas e se estica até a altura delas:
              // o topo do 50 alinha com o do 10/20 e a base do rótulo com a do 15.
              lead ? "col-span-2 lg:col-span-5 lg:row-span-2 lg:justify-between" : "lg:col-span-3"
            }`}
          >
            <dt
              className={`leading-snug text-balance ${
                lead
                  ? "mt-3 max-w-[24ch] text-xl font-medium text-ink md:text-2xl"
                  : "mt-2 max-w-[20ch] text-base text-muted"
              }`}
            >
              {stat.label}
            </dt>
            <dd
              className={`font-bold ${
                lead
                  ? "text-[6rem] leading-[0.78] tracking-[-0.05em] md:text-[10rem]"
                  : "text-5xl leading-[0.78] tracking-[-0.035em]"
              }`}
            >
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
        );
      })}
    </dl>
  );
}
