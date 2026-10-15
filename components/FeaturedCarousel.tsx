"use client";

import { useEffect, useState, type ReactNode } from "react";

const INTERVAL = 4000; // tempo que cada item fica em destaque (ms)
const TRANSITION = 700; // duração da animação para o lado (ms)
const GAP = 0.14; // espaço entre os quadrados (em múltiplos da largura base)
const OPACITIES = [1, 0.7, 0.45, 0.25, 0]; // por distância do centro
const DEFAULT_SCALES = [1.6, 1, 0.9, 0.8, 0.7]; // por distância do centro
const MAX_REACH = 3; // máximo de vizinhos visíveis de cada lado

const arrowButton =
  "pointer-events-auto inline-flex size-11 items-center justify-center rounded-full border border-brand-800 bg-brand-950/80 text-white backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200";

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
  /** Textos dos botões laterais (leitores de tela). */
  prevLabel?: string;
  nextLabel?: string;
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
  prevLabel = "Anterior",
  nextLabel = "Próximo",
}: FeaturedCarouselProps<T>) {
  const count = items.length;
  const animated = count > 1;
  const [state, setState] = useState({ position: 0, previous: 0 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const stopped = paused || hovered || focused;

  // Avança sozinho. O tempo recomeça a cada troca, inclusive nas feitas pelos botões.
  useEffect(() => {
    if (!animated || stopped) return;
    const id = setTimeout(
      () =>
        setState((current) => ({
          previous: current.position,
          position: current.position + 1,
        })),
      INTERVAL,
    );
    return () => clearTimeout(id);
  }, [animated, stopped, state.position]);

  if (count === 0) return null;

  const go = (delta: number) =>
    setState((current) => ({
      previous: current.position,
      position: current.position + delta,
    }));

  const scaleAt = (distance: number) =>
    scales[Math.min(distance, scales.length - 1)];
  const areaHeight = `calc(var(--tile) * var(--ratio) * ${scales[0] + 0.3})`;
  // A lista se repete para o ciclo nunca acabar (o "pulo" acontece fora da tela).
  const copies = animated ? Math.max(3, Math.ceil(11 / count)) : 1;
  const loop = Array.from({ length: copies }, () => items).flat();
  // A posição pode ficar negativa ao voltar, então o resto é normalizado.
  const active = items[((state.position % count) + count) % count];
  const step = Math.abs(state.position - state.previous);
  // Quantos vizinhos aparecem de cada lado sem repetir nenhum item.
  const reachLeft = Math.min(Math.floor((count - 1) / 2), MAX_REACH);
  const reachRight = Math.min(
    count - 1 - Math.floor((count - 1) / 2),
    MAX_REACH,
  );

  return (
    <div
      className={`relative ${sizeClass}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        // Só pausa para foco de teclado. O foco devolvido ao quadrado depois
        // de fechar o pop-up (ou de um toque) não conta.
        if ((event.target as HTMLElement).matches(":focus-visible")) {
          setFocused(true);
        }
      }}
      onBlur={() => setFocused(false)}
    >
      <div aria-hidden>
        <div
          className="carousel-mask relative overflow-hidden"
          style={{ height: areaHeight }}
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
            // Só aparece quem não repete nenhum item (veja reachLeft e reachRight).
            const shown = offset >= -reachLeft && offset <= reachRight;

            const props = {
              className: `absolute left-1/2 top-1/2 overflow-hidden rounded-2xl bg-paper shadow-lg shadow-black/20 ${
                shown ? "" : "pointer-events-none"
              }`,
              style: {
                width: "var(--tile)",
                height: "calc(var(--tile) * var(--ratio))",
                transform: `translate(-50%, -50%) translateX(calc(var(--tile) * ${unitsAt(offset, scales)})) scale(${scaleAt(distance)})`,
                opacity: shown
                  ? OPACITIES[Math.min(distance, OPACITIES.length - 1)]
                  : 0,
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

      {/* Botões laterais: ficam fora do aria-hidden para funcionar com teclado e leitor de tela. */}
      {animated && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-1 sm:px-2"
          style={{ height: areaHeight }}
        >
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => go(-1)}
            className={arrowButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => go(1)}
            className={arrowButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

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