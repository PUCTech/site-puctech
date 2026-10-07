"use client";

import { useEffect, useState, type ReactNode } from "react";

const INTERVAL = 5000; // tempo que cada item fica em destaque (ms)
const TRANSITION = 700; // duração da animação para o lado (ms)
const GAP = 0.14; // espaço entre os quadrados (em múltiplos da largura base)
const OPACITIES = [1, 0.7, 0.45, 0.25, 0]; // por distância do centro
const DEFAULT_SCALES = [1.6, 1, 0.9, 0.8, 0.7]; // por distância do centro

type FeaturedCarouselProps<T> = {
  items: T[];
  /** Nome do item (legenda, leitores de tela e lista de teclado). */
  getName: (item: T) => string;
  /** Conteúdo de cada quadrado. Ele preenche o quadrado inteiro. */
  renderTile: (item: T) => ReactNode;
  /** Texto abaixo do carrossel, sobre o item em destaque. */
  renderCaption?: (item: T) => ReactNode;
  /** Se existir, clicar em um quadrado chama esta função. */
  onSelect?: (item: T) => void;
  /** Para pausar a rotação por fora (ex.: com um pop-up aberto). */
  paused?: boolean;
  /** Classes que definem o tamanho: --tile (largura) e --ratio (altura ÷ largura). */
  sizeClass: string;
  /** Tamanho por distância do centro: o primeiro número é o do destaque. */
  scales?: number[];
};

// Quanto o quadrado se afasta do centro, em múltiplos da largura base.
function unitsAt(offset: number, scales: number[]) {
  const scaleAt = (distance: number) =>
    scales[Math.min(distance, scales.length - 1)];
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

export default function FeaturedCarousel<T>({
  items,
  getName,
  renderTile,
  renderCaption,
  onSelect,
  paused = false,
  sizeClass,
  scales = DEFAULT_SCALES,
}: FeaturedCarouselProps<T>) {
  const count = items.length;
  const animated = count > 1;
  const [state, setState] = useState({ position: 0, previous: 0 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const stopped = paused || hovered || focused;

  useEffect(() => {
    if (!animated || stopped) return;
    const id = setInterval(
      () =>
        setState((current) => ({
          previous: current.position,
          position: current.position + 1,
        })),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [animated, stopped]);

  if (count === 0) return null;

  const scaleAt = (distance: number) =>
    scales[Math.min(distance, scales.length - 1)];
  // A lista se repete para o ciclo nunca acabar (o "pulo" acontece fora da tela).
  const copies = animated ? Math.max(3, Math.ceil(11 / count)) : 1;
  const loop = Array.from({ length: copies }, () => items).flat();
  const active = items[state.position % count];
  const step = Math.abs(state.position - state.previous);

  return (
    <div
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div aria-hidden>
        <div
          className={`carousel-mask relative overflow-hidden ${sizeClass}`}
          style={{
            height: `calc(var(--tile) * var(--ratio) * ${scales[0] + 0.3})`,
          }}
        >
          {loop.map((item, index) => {
            const offset = animated
              ? offsetOf(index, state.position, loop.length)
              : 0;
            const previousOffset = animated
              ? offsetOf(index, state.previous, loop.length)
              : 0;
            // Quem "dá a volta" na lista é movido sem animação, fora da tela.
            const jumped = Math.abs(offset - previousOffset) > step;
            const distance = Math.abs(offset);

            const props = {
              className:
                "absolute left-1/2 top-1/2 overflow-hidden rounded-2xl bg-paper shadow-lg shadow-black/20",
              style: {
                width: "var(--tile)",
                height: "calc(var(--tile) * var(--ratio))",
                transform: `translate(-50%, -50%) translateX(calc(var(--tile) * ${unitsAt(offset, scales)})) scale(${scaleAt(distance)})`,
                opacity: OPACITIES[Math.min(distance, OPACITIES.length - 1)],
                transition: jumped
                  ? "none"
                  : `transform ${TRANSITION}ms ease-in-out, opacity ${TRANSITION}ms ease-in-out`,
              },
            };

            return onSelect ? (
              <button
                key={index}
                type="button"
                tabIndex={-1}
                onClick={() => onSelect(item)}
                {...props}
                className={`${props.className} cursor-pointer`}
              >
                {renderTile(item)}
              </button>
            ) : (
              <div key={index} {...props}>
                {renderTile(item)}
              </div>
            );
          })}
        </div>

        {renderCaption?.(active)}
      </div>

      {/* Quem navega pelo teclado ou usa leitor de tela escolhe por esta lista. */}
      {onSelect && (
        <ul className="sr-only focus-within:not-sr-only focus-within:mt-6 focus-within:flex focus-within:flex-wrap focus-within:justify-center focus-within:gap-2">
          {items.map((item) => (
            <li key={getName(item)}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-brand-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200"
              >
                {getName(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}