"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Partner = { name: string; logo?: string };

const INTERVAL = 3000; // tempo que cada parceiro fica em destaque (ms)
const TRANSITION = 700; // duração da animação para o lado (ms)
const COPIES = 3; // a lista se repete para o ciclo nunca acabar
const GAP = 0.14; // espaço entre os quadrados (em múltiplos do tamanho base)

// Tamanho e opacidade por distância do centro: 0 = destaque, 1 = vizinhos...
const SCALES = [1.8, 1, 0.9, 0.8, 0.7];
const OPACITIES = [1, 0.7, 0.45, 0.25, 0];

const scaleAt = (distance: number) =>
  SCALES[Math.min(distance, SCALES.length - 1)];

// Quanto o quadrado se afasta do centro, em múltiplos do tamanho base.
function unitsAt(offset: number) {
  const distance = Math.abs(offset);
  if (distance === 0) return 0;
  let units = scaleAt(0) / 2;
  for (let i = 1; i <= distance; i++) {
    units += GAP + scaleAt(i) / 2;
    if (i < distance) units += scaleAt(i) / 2;
  }
  return Math.sign(offset) * units;
}

// Posição do item em relação ao destaque, sempre entre -metade e +metade da lista.
function offsetOf(index: number, position: number, size: number) {
  const half = Math.floor(size / 2);
  return ((((index - position + half) % size) + size) % size) - half;
}

export default function PartnersCarousel({
  partners,
}: {
  partners: Partner[];
}) {
  const [state, setState] = useState({ position: 0, previous: 0 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () =>
        setState((current) => ({
          previous: current.position,
          position: current.position + 1,
        })),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [paused]);

  const loop = Array.from({ length: COPIES }, () => partners).flat();
  const active = partners[state.position % partners.length];
  const step = Math.abs(state.position - state.previous);

  return (
    <div
      aria-hidden
      className="mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="partners-mask relative h-[calc(var(--tile)*1.9)] overflow-hidden [--tile:5.5rem] sm:[--tile:7rem]">
        {loop.map((partner, index) => {
          const offset = offsetOf(index, state.position, loop.length);
          const previousOffset = offsetOf(index, state.previous, loop.length);
          // Quem "dá a volta" na lista é movido sem animação, fora da tela.
          const jumped = Math.abs(offset - previousOffset) > step;
          const distance = Math.abs(offset);

          return (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 flex size-(--tile) items-center justify-center overflow-hidden rounded-2xl bg-paper"
              style={{
                transform: `translate(-50%, -50%) translateX(calc(var(--tile) * ${unitsAt(offset)})) scale(${scaleAt(distance)})`,
                opacity: OPACITIES[Math.min(distance, OPACITIES.length - 1)],
                transition: jumped
                  ? "none"
                  : `transform ${TRANSITION}ms ease-in-out, opacity ${TRANSITION}ms ease-in-out`,
              }}
            >
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt=""
                  width={400}
                  height={400}
                  sizes="180px"
                  loading="eager"
                  className="size-full object-cover"
                />
              ) : (
                <span className="px-3 text-center text-sm font-semibold text-brand-950">
                  {partner.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-lg font-semibold">{active.name}</p>
    </div>
  );
}