"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/Section";
import { stats } from "@/data/home";

const DURATION = 1800;

export default function Stats() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = gridRef.current;
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (reduceMotion) {
          setProgress(1);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION, 1);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Section title="Nossos números">
      <div ref={gridRef} className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-paper p-6 text-center last:odd:col-span-2 lg:last:odd:col-span-1"
          >
            <p className="text-4xl font-bold text-brand-500">
              <span aria-hidden>
                {Math.round(stat.value * progress)}
                {stat.suffix}
              </span>
              <span className="sr-only">
                {stat.value}
                {stat.suffix}
              </span>
            </p>
            <p className="mt-2 text-balance text-sm text-brand-800">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}