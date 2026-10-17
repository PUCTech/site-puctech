"use client";

import { useEffect, useRef, useState } from "react";
import { DIM, FAINT, INVERSE, SOFT, scenes, withPrompt, type Frame, type Grid } from "@/components/asciiScenes";
import { container } from "@/components/Section";

// "PUCTech" em ASCII com uma chuva estilo Matrix: cada coluna tem uma gota de
// caracteres caindo. Quando a gota passa pela parte de uma letra, aquele trecho
// fica revelado. Depois a chuva continua fraquinha, atrás das letras.

const TEXT = "PUCTech";
const SHADES = ".:-=+*#%@"; // do traço mais fino (borda da letra) ao mais cheio
// Só ASCII: caracteres como os japoneses ocupam duas colunas e desalinham a grade.
const RAIN = "0123456789ABCDEFXYZ$+-*/=%<>{}[]|!?#&";
const FRAME_MS = 1000 / 30;
const SAMPLES = 4; // subamostras por célula, para suavizar as bordas das letras
// Linha do tempo: o "PUCTech" aparece, some numa dissolução e dá lugar a uma
// cena (donut.c, sl, pong...); depois volta, e a próxima cena entra.
const FIRST_LOGO_S = 9; // inclui os ~3 s em que a chuva revela as letras
const LOGO_S = 6;
const SCENE_S = 8;
const FADE_S = 0.8;

type Act = { frame: Frame; t: number; duration: number; scene: boolean };

type Drop = { y: number; speed: number; trail: number };

/** Cobertura (0 a 1) de cada célula da grade pelo texto. */
function rasterize(
  cols: number,
  rows: number,
  maxCols: number,
  cellRatio: number,
  family: string,
) {
  const w = cols * SAMPLES;
  const h = rows * SAMPLES;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array(cols * rows);

  // Cada célula é mais alta que larga, então o texto é achatado na vertical
  // para parecer proporcional na tela.
  ctx.font = `800 100px ${family}`;
  const textWidth = ctx.measureText(TEXT).width;
  const size = Math.min(
    (maxCols * SAMPLES * 100) / textWidth, // até a largura do conteúdo da página
    (h * 0.42) / cellRatio, // e até 42% da altura
  );
  ctx.font = `800 ${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.setTransform(1, 0, 0, cellRatio, w / 2, h * 0.45);
  ctx.fillText(TEXT, 0, 0);

  const alpha = ctx.getImageData(0, 0, w, h).data;
  const coverage = new Float32Array(cols * rows);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = ((y / SAMPLES) | 0) * cols + ((x / SAMPLES) | 0);
      coverage[i] += alpha[(y * w + x) * 4 + 3] / 255 / (SAMPLES * SAMPLES);
    }
  }
  return coverage;
}

const pick = (chars: string) => chars[(Math.random() * chars.length) | 0];

// Camadas de opacidade, da frente para trás: cheio, SOFT (65%), DIM (35%), FAINT (15%).
const LAYER_CLASS = ["", "opacity-65", "opacity-35", "opacity-15"];
const layerOf = (tone: number) => (tone === SOFT ? 1 : tone === DIM ? 2 : tone === FAINT ? 3 : 0);

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Camada invertida: trechos marcados viram <span> com fundo (azul-escuro no claro, ciano no escuro); o resto, espaços. */
function inverseHtml(cells: string[], inverse: Uint8Array, cols: number, rows: number) {
  if (!inverse.includes(1)) return "";
  const out: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    let c = 0;
    while (c < cols) {
      const i = r * cols + c;
      if (!inverse[i]) {
        line += " ";
        c++;
        continue;
      }
      let run = "";
      while (c < cols && inverse[r * cols + c]) run += cells[r * cols + c++];
      line += `<span class="bg-ink text-paper dark:bg-accent dark:text-on-accent">${escapeHtml(run)}</span>`;
    }
    out.push(line);
  }
  return out.join("\n");
}

/** Precisa de uma caixa com tamanho e posição (ex.: className="absolute inset-0"). */
export default function AsciiLogo({
  className = "relative h-96",
  tagline,
}: {
  className?: string;
  /** Fica centralizado logo abaixo das letras. */
  tagline?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLPreElement | null)[]>([]);
  // O subtítulo só aparece com o "PUCTech" formado e parado (some durante as cenas).
  const [titleOn, setTitleOn] = useState(false);
  const probeRef = useRef<HTMLSpanElement>(null);
  const inverseRef = useRef<HTMLPreElement>(null);
  const widthRef = useRef<HTMLDivElement>(null);
  const [below, setBelow] = useState<number | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const probe = probeRef.current;
    if (!box || !probe) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let cancelled = false;
    let setup: (() => void) | null = null;

    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() ||
      "sans-serif";
    // A Bricolage só é usada no canvas, então o fonts.ready não espera por ela: sem
    // pedir explicitamente, na primeira visita (sem cache) o canvas desenhava vazio.
    const fontsReady = Promise.all([
      document.fonts.ready,
      document.fonts.load(`800 100px ${family}`, TEXT),
    ]).catch(() => undefined);

    fontsReady.then(() => {
      if (cancelled) return;

      let cols = 0;
      let rows = 0;
      let glyphs: string[] = []; // caracteres da chuva, trocados aos poucos
      let reveal = new Float32Array(0); // até que linha cada coluna já foi revelada
      let drops: Drop[] = [];
      let last = 0;
      let logo: string[] = []; // as letras, na grade inteira
      let letterCols: number[] = []; // colunas que têm parte das letras
      let logoBottom = 0; // última linha das letras
      let revealedAll = false; // a chuva já revelou o logo inteiro?
      let titleReady = false;
      let promptX = 0; // coluna onde começa o conteúdo da página (para o "$ comando")
      let dissolve = new Float32Array(0); // ordem em que cada célula troca na dissolução
      let act: Act;
      let next: Act | null = null;
      let fade = 0;
      // Ordem aleatória: embaralha todas as cenas e toca cada uma uma vez antes de
      // repetir; a nova rodada nunca começa pela cena que acabou de passar.
      let queue: typeof scenes = [];
      let lastScene: (typeof scenes)[number] | null = null;
      const nextScene = () => {
        if (queue.length === 0) {
          queue = [...scenes].sort(() => Math.random() - 0.5);
          if (queue[0] === lastScene) queue.push(queue.shift()!);
        }
        lastScene = queue.shift()!;
        return lastScene;
      };

      const logoAct = (duration: number): Act => ({ frame: () => logo, t: 0, duration, scene: false });
      const sceneAct = (): Act => {
        const scene = nextScene();
        // As cenas usam a tela inteira.
        const frame = withPrompt(scene.make(cols, rows, cellRatio), scene.command, cols, rows, promptX, 1);
        return { frame, t: 0, duration: SCENE_S, scene: true };
      };
      let cellRatio = 0.6;

      /** Avança a linha do tempo e devolve a grade do quadro atual. */
      const stageFrame = (dt: number) => {
        if (!next && act.t >= act.duration) {
          next = act.scene ? logoAct(LOGO_S) : sceneAct();
          fade = 0;
        }
        const current = act.frame(act.t, dt);
        act.t += dt;
        if (!next) return current;

        const incoming = next.frame(next.t, dt);
        next.t += dt;
        fade += dt / FADE_S;
        if (fade >= 1) {
          act = next;
          next = null;
          return incoming;
        }
        // Dissolução: cada célula (e o estilo dela) vem de uma das duas cenas.
        const mixed: Grid = current.map((ch, i) => (dissolve[i] < fade ? incoming[i] : ch));
        if (current.style || incoming.style) {
          const style = new Uint8Array(mixed.length);
          for (let i = 0; i < style.length; i++) {
            style[i] = (dissolve[i] < fade ? incoming.style?.[i] : current.style?.[i]) ?? 0;
          }
          mixed.style = style;
        }
        return mixed;
      };

      const draw = (dt: number) => {
        const layers = LAYER_CLASS.map(() => new Array<string>(cols * rows).fill(" "));
        const inverse = new Uint8Array(cols * rows); // células com fundo ciano
        const clear = (i: number) => {
          for (const layer of layers) layer[i] = " ";
        };

        // A chuva troca alguns caracteres a cada quadro, como no terminal.
        for (let k = 0; k < cols * rows * 0.01; k++) {
          glyphs[(Math.random() * glyphs.length) | 0] = pick(RAIN);
        }

        if (!reduce) {
          for (let c = 0; c < cols; c++) {
            const drop = drops[c];
            drop.y += drop.speed * dt;
            reveal[c] = Math.max(reveal[c], drop.y);
            const head = Math.floor(drop.y);

            // A cabeça da gota é cheia e o rastro vai sumindo: 65% → 35% → 15%.
            for (let r = Math.max(0, head - drop.trail); r <= head && r < rows; r++) {
              const f = (head - r) / drop.trail;
              layers[r === head ? 0 : f < 0.3 ? 1 : f < 0.65 ? 2 : 3][r * cols + c] = glyphs[r * cols + c];
            }

            // Saiu pela parte de baixo: volta lá para cima, mais devagar e espaçada.
            if (head - drop.trail > rows) {
              drop.y = -Math.random() * rows * 1.5;
              drop.speed = 10 + Math.random() * 20;
            }
          }
        }

        const cells: Grid = reduce ? logo : stageFrame(dt);

        // Durante as cenas a chuva some, para a cena ficar legível. Na troca, ela
        // some (ou volta) célula a célula, junto com a dissolução.
        const entering = !act.scene && next?.scene;
        const leaving = act.scene && next && !next.scene;
        const hideRain = (i: number) =>
          !reduce &&
          (entering ? dissolve[i] < fade : leaving ? dissolve[i] >= fade : act.scene);

        const style = cells.style;
        for (let i = 0; i < cells.length; i++) {
          const tone = style?.[i] ?? 0;
          if (tone === INVERSE) {
            inverse[i] = 1;
            clear(i);
          } else if (cells[i] !== " " && ((i / cols) | 0) <= reveal[i % cols]) {
            clear(i);
            layers[layerOf(tone)][i] = cells[i];
          } else if (hideRain(i)) {
            clear(i);
          }
        }

        // Subtítulo: só com o logo inteiro na tela, sem cena entrando ou saindo.
        if (!revealedAll) revealedAll = letterCols.every((c) => reveal[c] > logoBottom);
        const ready = reduce || (!act.scene && !next && revealedAll);
        if (ready !== titleReady) {
          titleReady = ready;
          setTitleOn(ready);
        }

        const join = (cells: string[]) => {
          const out: string[] = [];
          for (let r = 0; r < rows; r++) out.push(cells.slice(r * cols, (r + 1) * cols).join(""));
          return out.join("\n");
        };
        layers.forEach((layer, k) => {
          const el = layerRefs.current[k];
          if (el) el.textContent = join(layer);
        });
        if (inverseRef.current) inverseRef.current.innerHTML = inverseHtml(cells, inverse, cols, rows);
      };

      setup = () => {
        // Mede o caractere de verdade: a grade cobre a caixa inteira.
        const rect = probe.getBoundingClientRect();
        const charW = rect.width / 10;
        const charH = rect.height;
        cols = Math.max(1, Math.floor(box.clientWidth / charW));
        rows = Math.max(1, Math.floor(box.clientHeight / charH));
        // As letras ocupam a mesma largura do conteúdo do resto da página.
        const content = widthRef.current;
        const style = content && getComputedStyle(content);
        const contentWidth = style
          ? content.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
          : box.clientWidth * 0.8;
        const coverage = rasterize(cols, rows, contentWidth / charW, charW / charH, family);
        let lastRow = 0;
        coverage.forEach((c, i) => {
          if (c >= 0.12) lastRow = Math.max(lastRow, (i / cols) | 0);
        });
        setBelow((lastRow + 1) * charH);
        logoBottom = lastRow;
        letterCols = [];
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r <= lastRow; r++) {
            if (coverage[r * cols + c] >= 0.12) {
              letterCols.push(c);
              break;
            }
          }
        }
        revealedAll = false;
        titleReady = false;
        setTitleOn(false);
        logo = Array.from(coverage, (c) =>
          c < 0.12 ? " " : SHADES[Math.min(SHADES.length - 1, Math.floor(c * SHADES.length))],
        );
        cellRatio = charW / charH;
        promptX = Math.max(0, Math.floor((cols - contentWidth / charW) / 2));
        dissolve = Float32Array.from({ length: logo.length }, () => Math.random());
        act = logoAct(FIRST_LOGO_S);
        next = null;
        queue = [];
        glyphs = Array.from({ length: cols * rows }, () => pick(RAIN));
        reveal = new Float32Array(cols).fill(reduce ? rows : -1);
        // A primeira gota de cada coluna começa acima da tela, em alturas diferentes.
        drops = Array.from({ length: cols }, () => ({
          y: -Math.random() * rows * 0.8,
          speed: 18 + Math.random() * 30,
          trail: 6 + ((Math.random() * 18) | 0),
        }));
        last = performance.now();
        draw(0);
      };

      setup();
      if (reduce) return;

      const tick = (now: number) => {
        if (visible && now - last >= FRAME_MS) {
          // Limita o salto de tempo (aba em segundo plano, por exemplo).
          draw(Math.min((now - last) / 1000, 0.1));
          last = now;
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    // Recalcula a grade quando a caixa muda de tamanho.
    let resizeTimer = 0;
    const resize = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => setup?.(), 150);
    });
    resize.observe(box);

    // Fora da tela, não desenha.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(box);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      resize.disconnect();
      io.disconnect();
    };
  }, []);

  const layer =
    "pointer-events-none absolute inset-0 m-0 select-none overflow-hidden whitespace-pre font-mono text-[7px] leading-none text-ink sm:text-[9px] dark:text-accent";
  return (
    <div ref={boxRef} className={`overflow-hidden ${className}`}>
      {/* Só para medir o tamanho de um caractere. */}
      <span ref={probeRef} aria-hidden className={`${layer} invisible inset-auto`}>
        0000000000
      </span>
      {/* Só para medir a largura do conteúdo da página. */}
      <div ref={widthRef} className={`${container} invisible h-0`} />
      {/* Camadas de trás para a frente: 15%, 35%, 65% e cheia. */}
      {[3, 2, 1, 0].map((k) => (
        <pre
          key={k}
          ref={(el) => {
            layerRefs.current[k] = el;
          }}
          aria-hidden
          className={`${layer} ${LAYER_CLASS[k]}`}
        />
      ))}
      <pre ref={inverseRef} aria-hidden className={layer} />
      {tagline && (
        // Posicionado logo abaixo das letras. É só visual (o texto real está no <h1>
        // da página); sem JavaScript, o <noscript> deixa as letras visíveis.
        <div
          data-hero-title
          aria-hidden
          className="pointer-events-none absolute inset-x-0 px-5 text-center"
          style={{ top: below === null ? "62%" : below + 24 }}
        >
          <span
            className={`inline-block rounded-full px-4 py-1.5 text-base font-medium tracking-[-0.01em] text-balance text-muted transition-colors duration-500 md:text-xl ${
              titleOn ? "bg-paper" : "bg-transparent"
            }`}
          >
            <ScrambleText text={tagline} visible={titleOn} />
          </span>
          <noscript>
            <style>{"[data-hero-title] .invisible{visibility:visible!important}"}</style>
          </noscript>
        </div>
      )}
    </div>
  );
}

/**
 * Texto que aparece e some como o ASCII: cada letra passa por caracteres
 * aleatórios antes de assentar (ou de sumir), em ordem embaralhada. Cada letra
 * guarda a largura da letra real, então a linha não treme durante o efeito.
 */
function ScrambleText({ text, visible }: { text: string; visible: boolean }) {
  const [glyphs, setGlyphs] = useState<string[]>(() => Array.from(text, () => ""));
  // Estado em que o texto está de fato (começa escondido). Só anima quando muda:
  // assim ele não "some" ao carregar a página, quando já estava escondido.
  const shown = useRef(false);

  useEffect(() => {
    if (visible === shown.current) return;
    shown.current = visible;
    const letters = Array.from(text);
    const final = letters.map((ch) => (visible ? ch : ""));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setGlyphs(final));
      return () => cancelAnimationFrame(id);
    }
    const SPREAD = 500; // ms entre a primeira e a última letra começarem
    const SCRAMBLE = 350; // ms que cada letra fica embaralhando
    const delays = letters.map(() => Math.random() * SPREAD);
    const start = performance.now();
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= SPREAD + SCRAMBLE) {
        setGlyphs(final);
        return;
      }
      if (now - last > 40) {
        last = now;
        setGlyphs(
          letters.map((ch, i) => {
            if (ch === " ") return " ";
            const p = (elapsed - delays[i]) / SCRAMBLE;
            if (p < 0) return visible ? "" : ch;
            if (p < 1) return pick(RAIN);
            return visible ? ch : "";
          }),
        );
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, visible]);

  // Palavras inteiras não quebram no meio; cada letra real fica invisível por baixo
  // (guardando a largura) e o caractere da vez aparece por cima.
  const words = text.split(" ");
  // Posição de cada palavra no texto (cada espaço conta 1).
  const starts = words.map((_, w) => words.slice(0, w).join(" ").length + (w > 0 ? 1 : 0));
  return (
    <>
      {words.map((word, w) => {
        const start = starts[w];
        return (
          <span key={w}>
            {w > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word, (ch, k) => (
                <span key={k} className="relative">
                  <span className="invisible">{ch}</span>
                  <span className="absolute inset-0 text-center">{glyphs[start + k]}</span>
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </>
  );
}
