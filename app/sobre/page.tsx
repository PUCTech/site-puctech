import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { Heading, Stage } from "@/components/Section";
// import FontCycle from "@/components/FontCycle";
import Typewriter from "@/components/Typewriter";
import {
  aboutPage,
  difference,
  history,
  support,
  values,
  vision,
} from "@/data/about";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Conheça a visão, os valores e a história da PUC Tech, a primeira liga de ciência e tecnologia da PUC-SP.",
};

// Ícones de linha para os valores, no mesmo traço do AreaIcon (estilo Lucide).
const valueIcons: Record<string, ReactNode> = {
  "Protagonismo Estudantil": (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  "Colaboração e Comunidade": (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  "Excelência e Aprendizado Contínuo": <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />,
  "Inovação com Responsabilidade": (
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" />
  ),
  "Conexão com o Mundo Real": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </>
  ),
};

const monthName = (month: number) =>
  new Date(2000, month - 1).toLocaleString("pt-BR", { month: "long" });

// "17 de setembro de 2026", "julho de 2025" ou só "2024".
const dateLabel = ({ year, month, day }: { year: number; month?: number; day?: number }) =>
  [day, month && monthName(month), year].filter(Boolean).join(" de ");

// Anos da linha do tempo: do primeiro marco até o ano atual (do build).
const firstYear = history.milestones[0].year;
const years = Array.from(
  { length: new Date().getFullYear() - firstYear + 1 },
  (_, i) => firstYear + i,
);

/**
 * Linha do tempo. No desktop, cada ano é um trecho igual da linha (o primeiro
 * numa ponta, o atual na outra) e cada marco fica no seu mês, ligado ao texto
 * por um pontilhado. No celular, os marcos ficam agrupados por ano.
 */
// Desktop da linha do tempo (a partir de xl, conteúdo com ~1216px ou mais).
const LABEL_W = 0.145; // largura do texto de um marco (w-44), como fração da linha
const LEVEL = 120; // altura mínima (px) de um marco acima da linha (livra os anos)
const STEP = 84; // distância (px) entre alturas: cabe um texto de duas linhas

/**
 * Alturas dos marcos acima da linha. O texto sai para o lado (direita, ou esquerda
 * perto do fim); se ele cobrir o pontilhado de um vizinho, fica acima dele; se dois
 * textos se cruzam sem isso, o de depois sobe. Repete até ninguém se tocar.
 */
function aboveLevels(items: { pos: number; flip: boolean }[]) {
  const span = ({ pos, flip }: { pos: number; flip: boolean }) =>
    flip ? [pos - LABEL_W, pos] : [pos, pos + LABEL_W];
  const levels = items.map(() => LEVEL);
  for (let round = 0; round < 10; round++) {
    let changed = false;
    const raise = (i: number, min: number) => {
      if (levels[i] < min) {
        levels[i] = min;
        changed = true;
      }
    };
    for (let a = 0; a < items.length; a++) {
      for (let b = a + 1; b < items.length; b++) {
        const [a0, a1] = span(items[a]);
        const [b0, b1] = span(items[b]);
        if (a1 <= b0 || b1 <= a0) continue; // textos não se cruzam
        const bUnderA = items[b].pos >= a0 && items[b].pos <= a1;
        const aUnderB = items[a].pos >= b0 && items[a].pos <= b1;
        if (bUnderA && !aUnderB) raise(a, levels[b] + STEP);
        else if (aUnderB && !bUnderA) raise(b, levels[a] + STEP);
        else if (Math.abs(levels[a] - levels[b]) < STEP) raise(b, levels[a] + STEP);
      }
    }
    if (!changed) break;
  }
  return levels;
}

function Timeline() {
  // Posição de 0 a 1 na linha: no dia do marco, ou no meio do mês se não tiver dia.
  const at = (year: number, month = 1, day?: number) =>
    ((year - firstYear) * 12 + month - 1 + (day ? day / 31 : 0.5)) / (years.length * 12);
  const now = new Date();
  const today = at(now.getFullYear(), now.getMonth() + 1);

  const marks = history.milestones.map((item) => ({ item, pos: at(item.year, item.month, item.day), below: Boolean(item.photo) }));
  const above = marks.filter((m) => !m.below).map((m) => ({ ...m, flip: m.pos > 0.75 }));
  const levels = aboveLevels(above);
  // Altura da faixa acima da linha: o marco mais alto mais o texto dele.
  const lineTop = Math.max(...levels) + 8;

  return (
    <>
      {/* Marcos sem foto ficam acima da linha; os com foto, abaixo. */}
      {/* No desktop a linha usa a largura toda da janela (com um limite em telas enormes). */}
      <div className="relative left-1/2 mt-14 hidden w-screen -translate-x-1/2 px-8 xl:block xl:px-12">
        <div className="relative mx-auto max-w-[110rem]" style={{ height: lineTop + 260, "--line": `${lineTop}px` } as CSSProperties}>
          {/* Até hoje a linha é cheia; o resto do ano atual fica apagado. */}
          <span aria-hidden className="absolute inset-x-0 top-(--line) h-0.5 bg-border" />
          <span
            aria-hidden
            className="timeline-line absolute left-0 top-(--line) h-0.5 bg-accent"
            style={{ width: `${today * 100}%` }}
          />
          {years.slice(1).map((year, i) => (
            <span
              key={year}
              aria-hidden
              className="absolute top-[calc(var(--line)-0.5rem)] h-5 w-px bg-border"
              style={{ left: `${((i + 1) / years.length) * 100}%` }}
            />
          ))}
          {/* Cada ano fica centralizado no tracinho onde ele termina, logo acima da linha. */}
          <ol aria-hidden>
            {years.map((year, i) => (
              <li
                key={year}
                className="absolute top-[calc(var(--line)-2rem)] z-10 -translate-x-1/2 bg-paper px-1.5 text-lg font-bold tracking-[-0.02em]"
                style={{ left: `${((i + 1) / years.length) * 100}%` }}
              >
                {year}
              </li>
            ))}
          </ol>

          <ol>
            {marks.map(({ item, pos, below }, i) => {
              const rank = marks.slice(0, i).filter((m) => m.below === below).length;
              // Fotos alternam o lado (esquerda, direita, esquerda...) para não se encostarem;
              // perto do fim vão sempre para a esquerda.
              const flip = below ? rank % 2 === 0 || pos > 0.85 : above[rank].flip;
              const height = below ? 0 : levels[rank]; // px, acima da linha
              return (
                <li
                  key={item.label}
                  className={`timeline-mark absolute ${flip ? "-translate-x-full pr-4 text-right" : "pl-4"} ${
                    below ? "top-[calc(var(--line)+1px)] pt-6" : "bottom-[calc(100%-var(--line))]"
                  }`}
                  style={{ left: `${pos * 100}%`, height: below ? undefined : height, "--at": pos / today } as CSSProperties}
                >
                  {item.photo && (
                    <>
                      {/* Um caminho só: desce da linha, faz a curva e entra no meio da foto.
                          Altura fixa = pt-6 + metade da foto (w-36 em 4:3) = 78px. */}
                      <MarchingDots
                        length={88}
                        d={flip ? "M15 0 V64 Q15 78 1 78 H0" : "M1 0 V64 Q1 78 15 78 H16"}
                        className={`top-0 h-[80px] w-4 ${flip ? "right-0" : "left-0"}`}
                      />
                      <Image
                        src={item.photo}
                        alt={item.photoAlt ?? ""}
                        width={480}
                        height={360}
                        className={`aspect-[4/3] w-36 rounded-xl object-cover ${flip ? "ml-auto" : ""}`}
                      />
                    </>
                  )}
                  <p className={`font-mono text-sm text-accent-ink ${below ? "mt-3" : ""}`}>
                    {/* Embaixo das fotos estreitas, a data curta (28/06/2025) cabe numa linha. */}
                    {below && item.day && item.month
                      ? `${String(item.day).padStart(2, "0")}/${String(item.month).padStart(2, "0")}/${item.year}`
                      : dateLabel(item)}
                  </p>
                  <p className={`mt-1 font-semibold leading-snug text-balance ${below ? "w-36 text-sm" : "w-44"}`}>
                    {item.label}
                  </p>
                  <span
                    aria-hidden
                    className={`absolute size-3 rounded-full bg-accent ring-4 ring-paper ${
                      below ? "-top-[7px]" : "-bottom-[7px]"
                    } ${flip ? "-right-[7px]" : "-left-[7px]"}`}
                  />
                  {!below && (
                    <MarchingDots
                      length={height}
                      d={`M1 ${height} V0`}
                      className={`inset-y-0 w-0.5 ${flip ? "right-0" : "left-0"}`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <ol className="relative mt-12 grid grid-cols-3 xl:hidden">
        <span
          aria-hidden
          className="timeline-line absolute inset-x-0 top-1.5 h-0.5 bg-gradient-to-r from-accent from-75% to-transparent"
        />
        {years.map((year) => (
          <li key={year} className="relative pr-4">
            <span aria-hidden className="block size-3.5 rounded-full border-2 border-accent bg-paper" />
            <p className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{year}</p>
            <ul className="mt-2 space-y-1 text-[15px] leading-snug text-pretty text-muted">
              {history.milestones
                .filter((item) => item.year === year)
                .map((item) => (
                  <li key={item.label}>
                    {item.month && (
                      <span className="capitalize">
                        {[item.day, monthName(item.month)].filter(Boolean).join(" de ")}:{" "}
                      </span>
                    )}
                    {item.label}
                    {item.photo && (
                      <Image
                        src={item.photo}
                        alt={item.photoAlt ?? ""}
                        width={320}
                        height={240}
                        className="mt-2 aspect-[4/3] w-full rounded-lg object-cover"
                      />
                    )}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}

const DOT_GAP = 6; // px entre os pontos do pontilhado
const DOT_SPEED = 4; // px por segundo: bem devagar

/**
 * Pontilhado que anda ao longo de `d` (da linha até o marco). Cada ponto desliza
 * pelo caminho com offset-path, que é suave mesmo devagar, e some nas pontas.
 */
function MarchingDots({ d, length, className }: { d: string; length: number; className: string }) {
  const count = Math.ceil(length / DOT_GAP);
  const duration = length / DOT_SPEED;
  return (
    <span aria-hidden className={`absolute ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="march-dot"
          style={{
            offsetPath: `path("${d}")`,
            animationDuration: `${duration}s`,
            animationDelay: `${(-i / count) * duration}s`,
          }}
        />
      ))}
    </span>
  );
}

// Mesmo ritmo da home: título, texto logo abaixo e o conteúdo.
const gap = "py-12 md:py-16";

export default function SobrePage() {
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <Reveal>
          <h1 className="fade-in text-5xl font-bold tracking-[-0.04em] md:text-7xl">
            {aboutPage.title}
            {/* Desligado: a troca de fontes fazia o layout pular. */}
            {/* <FontCycle text="PUC Tech" className="text-accent-ink" /> */}
          </h1>
          <p className="fade-in mt-6 max-w-3xl text-xl leading-relaxed [animation-delay:250ms] text-pretty text-muted md:text-2xl">
            {aboutPage.intro}
          </p>
        </Reveal>
      </Stage>

      {/* Visão: a única faixa de cor da página, como o processo seletivo na home. */}
      <Stage id="visao" className="bg-accent text-on-accent">
        <Reveal>
          <div className="py-14 md:py-20">
            <h2 className="font-medium">{vision.title}</h2>
            <p className="mt-3 max-w-5xl text-2xl leading-snug tracking-[-0.02em] text-balance md:text-4xl [&_strong]:font-bold [&_strong]:text-on-accent">
              <Typewriter text={vision.text} />
            </p>
          </div>
        </Reveal>
      </Stage>

      <Stage id="diferenca" className={gap}>
        <Heading title={difference.title} />
        <Reveal delay={150}>
          <ol className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {difference.items.map((item, index) => (
              <li key={item.title} className="grid grid-cols-[2.25rem_1fr] content-start items-baseline">
                <span className="font-mono text-sm text-accent-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-xl font-semibold leading-snug text-balance">{item.title}</p>
                <p className="col-start-2 mt-2 leading-relaxed text-pretty text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Stage>

      <Stage id="valores" className={gap}>
        <Heading title={values.title} />
        <Reveal delay={150}>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.items.map((value) => (
              <li key={value.title} className="grid grid-cols-[2.5rem_1fr] content-start items-center gap-y-1.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="size-6 text-accent-ink"
                >
                  {valueIcons[value.title]}
                </svg>
                <p className="font-semibold leading-snug text-balance">{value.title}</p>
                <p className="col-start-2 text-[15px] leading-relaxed text-pretty text-muted">{value.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>

      <Stage id="historia" className={`${gap} overflow-x-clip`}>
        <Heading title={history.title} wide>
          {history.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </Heading>
        <Reveal delay={150}>
          <Timeline />
        </Reveal>
      </Stage>

      <Stage id="apoio" className="pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
          <Heading title={support.title}>
            <p>{support.intro}</p>
          </Heading>
          <Reveal delay={150}>
            <figure className="flex items-center gap-4 md:flex-col md:items-start">
              <Image
                src={support.logo}
                alt="Logo da PUC-SP"
                width={160}
                height={160}
                className="size-20 rounded-2xl object-cover md:size-32"
              />
              <figcaption className="font-mono text-sm text-muted">PUC-SP</figcaption>
            </figure>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <p className="mt-14 font-mono text-sm text-accent-ink">{support.backersIntro}</p>
          {/* Lista em linhas, no mesmo tom numerado do "Por que e como". */}
          <ol className="mt-4 divide-y divide-border border-y border-border">
            {support.backers.map((name, index) => (
              <li key={name} className="grid grid-cols-[2.25rem_1fr] items-baseline py-5">
                <span className="font-mono text-sm text-accent-ink">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-xl font-semibold tracking-[-0.015em] text-balance md:text-2xl">{name}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-lg text-pretty text-muted">{support.closing}</p>
        </Reveal>
      </Stage>
    </main>
  );
}
