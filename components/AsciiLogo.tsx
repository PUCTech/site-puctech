"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { scenes, withPrompt, type Frame } from "@/components/asciiScenes";
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

/** Precisa de uma caixa com tamanho e posição (ex.: className="absolute inset-0"). */
export default function AsciiLogo({
  className = "relative h-96",
  children,
}: {
  className?: string;
  /** Fica centralizado logo abaixo das letras. */
  children?: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const brightRef = useRef<HTMLPreElement>(null);
  const dimRef = useRef<HTMLPreElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
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

    document.fonts.ready.then(() => {
      if (cancelled) return;
      const family =
        getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() ||
        "sans-serif";

      let cols = 0;
      let rows = 0;
      let glyphs: string[] = []; // caracteres da chuva, trocados aos poucos
      let reveal = new Float32Array(0); // até que linha cada coluna já foi revelada
      let drops: Drop[] = [];
      let last = 0;
      let logo: string[] = []; // as letras, na grade inteira
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
        return current.map((ch, i) => (dissolve[i] < fade ? incoming[i] : ch));
      };

      const draw = (dt: number) => {
        const bright = new Array<string>(cols * rows).fill(" ");
        const dim = new Array<string>(cols * rows).fill(" ");

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

            for (let r = Math.max(0, head - drop.trail); r <= head && r < rows; r++) {
              const i = r * cols + c;
              if (r === head) bright[i] = glyphs[i];
              else dim[i] = glyphs[i];
            }

            // Saiu pela parte de baixo: volta lá para cima, mais devagar e espaçada.
            if (head - drop.trail > rows) {
              drop.y = -Math.random() * rows * 1.5;
              drop.speed = 10 + Math.random() * 20;
            }
          }
        }

        const cells = reduce ? logo : stageFrame(dt);

        // Durante as cenas a chuva some, para a cena ficar legível. Na troca, ela
        // some (ou volta) célula a célula, junto com a dissolução.
        const entering = !act.scene && next?.scene;
        const leaving = act.scene && next && !next.scene;
        const hideRain = (i: number) =>
          !reduce &&
          (entering ? dissolve[i] < fade : leaving ? dissolve[i] >= fade : act.scene);

        for (let i = 0; i < cells.length; i++) {
          if (cells[i] !== " " && ((i / cols) | 0) <= reveal[i % cols]) {
            bright[i] = cells[i];
            dim[i] = " ";
          } else if (hideRain(i)) {
            bright[i] = " ";
            dim[i] = " ";
          }
        }

        const join = (cells: string[]) => {
          const out: string[] = [];
          for (let r = 0; r < rows; r++) out.push(cells.slice(r * cols, (r + 1) * cols).join(""));
          return out.join("\n");
        };
        if (brightRef.current) brightRef.current.textContent = join(bright);
        if (dimRef.current) dimRef.current.textContent = join(dim);
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
    "pointer-events-none absolute inset-0 m-0 select-none overflow-hidden whitespace-pre font-mono text-[7px] leading-none text-accent sm:text-[9px]";
  return (
    <div ref={boxRef} className={`overflow-hidden ${className}`}>
      {/* Só para medir o tamanho de um caractere. */}
      <span ref={probeRef} aria-hidden className={`${layer} invisible inset-auto`}>
        0000000000
      </span>
      {/* Só para medir a largura do conteúdo da página. */}
      <div ref={widthRef} className={`${container} invisible h-0`} />
      <pre ref={dimRef} aria-hidden className={`${layer} opacity-30`} />
      <pre ref={brightRef} aria-hidden className={layer} />
      {children && (
        // Fica invisível até as letras serem medidas e então aparece já no lugar
        // (sem pular de posição). Sem JavaScript, o <noscript> mostra o título.
        <div
          data-hero-title
          className="absolute inset-x-0 px-5 text-center transition-opacity duration-1000 ease-out motion-reduce:transition-none"
          style={{ top: below === null ? "62%" : below + 24, opacity: below === null ? 0 : 1 }}
        >
          {children}
          <noscript>
            <style>{"[data-hero-title]{opacity:1!important}"}</style>
          </noscript>
        </div>
      )}
    </div>
  );
}
