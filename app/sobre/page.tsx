import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { Heading, Stage } from "@/components/Section";
// import FontCycle from "@/components/FontCycle";
import TimelineScroller from "@/components/TimelineScroller";
import Typewriter from "@/components/Typewriter";
import { about, milestones, supportLogo, valueIcons } from "@/data/about";
import { langInfo, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = about[lang];
  return { title: t.title, description: t.description };
}

// Ícones de linha para os valores, no mesmo traço do AreaIcon (estilo Lucide).
const icons: Record<(typeof valueIcons)[number], ReactNode> = {
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  people: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  graduation: <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />,
  idea: (
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </>
  ),
};

type When = { year: number; month?: number; day?: number };

// Data por extenso no idioma: "17 de setembro de 2026" / "September 17, 2026", "julho de 2025" ou só "2024".
const dateLabel = ({ year, month, day }: When, lang: Lang) =>
  month
    ? new Date(Date.UTC(year, month - 1, day ?? 1)).toLocaleDateString(langInfo[lang].intl, {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        ...(day ? { day: "numeric" } : {}),
      })
    : String(year);

// Data curta, para baixo das fotos estreitas: 28/06/2025 (ou 06/28/2025 em inglês).
const shortDate = ({ year, month, day }: When, lang: Lang) =>
  new Date(Date.UTC(year, month! - 1, day)).toLocaleDateString(langInfo[lang].intl, {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Anos da linha do tempo: do primeiro marco até o ano atual (do build).
const firstYear = milestones[0].year;
const years = Array.from(
  { length: new Date().getFullYear() - firstYear + 1 },
  (_, i) => firstYear + i,
);

/**
 * Linha do tempo. No desktop, cada ano é um trecho igual da linha (o primeiro
 * numa ponta, o atual na outra) e cada marco fica no seu mês, ligado ao texto
 * por um pontilhado. No celular, os marcos ficam agrupados por ano.
 */
// A linha do tempo rola na horizontal: cada ano tem a mesma largura fixa, então
// cabe qualquer quantidade de marcos sem apertar.
const YEAR_PX = 880; // fotos a dois meses de distância cabem lado a lado
const MONTH_PX = YEAR_PX / 12;
// Trechos sem nada por mais de MAX_GAP meses ficam curtos (GAP_PX): a linha só
// gasta espaço onde aconteceu alguma coisa.
const MAX_GAP = 4;
const GAP_PX = 96;

/** Meses desde o começo do primeiro ano: no dia, ou no meio do mês. */
const monthsOf = (year: number, month = 1, day?: number) =>
  (year - firstYear) * 12 + month - 1 + (day ? day / 31 : 0.5);
const eventMonths = milestones.map((m) => monthsOf(m.year, m.month, m.day)).sort((a, b) => a - b);
const START = eventMonths[0] - 1; // a linha começa um mês antes do primeiro marco
const END = years.length * 12; // e termina no fim do ano atual
const gaps = eventMonths
  .slice(1)
  .map((b, i) => [eventMonths[i] + 1, b - 1])
  .filter(([a, b]) => b - a > MAX_GAP - 2);

/** Posição (px) de um momento na linha, já com os trechos vazios encurtados. */
function px(t: number) {
  let x = 0;
  let cur = START;
  for (const [a, b] of gaps) {
    if (t <= a) return x + (t - cur) * MONTH_PX;
    x += (a - cur) * MONTH_PX;
    if (t <= b) return x + ((t - a) / (b - a)) * GAP_PX;
    x += GAP_PX;
    cur = b;
  }
  return x + (t - cur) * MONTH_PX;
}
const TRACK_PX = px(END);
const LABEL_W = 192 / TRACK_PX; // largura do texto de um marco (w-44 + folga), como fração da linha
const LEVEL = 100; // altura mínima (px) de um marco acima da linha (livra os anos)
const STEP = 72; // distância (px) entre alturas: cabe um texto de duas linhas
const PHOTO_W = 176 / TRACK_PX; // largura de um marco com foto (w-36 + pontilhado), como fração da linha

const LANE_PX = 240; // altura de uma fileira de fotos (foto + data + até 3 linhas de texto)

/**
 * Onde cada foto vai embaixo da linha: na primeira fileira em que couber, à direita
 * e senão à esquerda, sem encostar em nenhuma outra. Fileiras de baixo têm o
 * pontilhado mais comprido (ele passa por trás das fotos de cima).
 */
function photoSlots(positions: number[]) {
  const lanes: [number, number][][] = []; // trechos já ocupados em cada fileira
  return positions.map((pos) => {
    for (let lane = 0; ; lane++) {
      const taken = (lanes[lane] ??= []);
      const fits = ([a, b]: [number, number]) => a >= 0 && b <= 1 && taken.every(([x, y]) => b <= x || a >= y);
      const right: [number, number] = [pos, pos + PHOTO_W];
      const left: [number, number] = [pos - PHOTO_W, pos];
      const span = fits(right) ? right : fits(left) ? left : null;
      if (span) {
        taken.push(span);
        return { lane, flip: span === left };
      }
    }
  });
}

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

function Timeline({ lang }: { lang: Lang }) {
  // Posição de 0 a 1 na linha: no dia do marco, ou no meio do mês se não tiver dia.
  const at = (year: number, month?: number, day?: number) => px(monthsOf(year, month, day)) / TRACK_PX;
  const now = new Date();
  const today = px(Math.min(END, monthsOf(now.getFullYear(), now.getMonth() + 1))) / TRACK_PX;

  const marks = milestones.map((item) => ({ item, pos: at(item.year, item.month, item.day), below: Boolean(item.photo) }));
  const above = marks.filter((m) => !m.below).map((m) => ({ ...m, flip: m.pos + LABEL_W > 1 }));
  const levels = aboveLevels(above);
  const slots = photoSlots(marks.filter((m) => m.below).map((m) => m.pos));
  const lanes = Math.max(1, ...slots.map((slot) => slot.lane + 1));
  // Altura da faixa acima da linha: o marco mais alto mais o texto dele.
  const lineTop = Math.max(...levels) + 8;

  return (
    <>
      {/* Marcos sem foto ficam acima da linha; os com foto, abaixo. */}
      {/* No desktop a linha usa a largura toda da janela (com um limite em telas enormes). */}
      {/* A linha do tempo sai do container e usa a largura da janela, para caber inteira. */}
      <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2 px-4 md:px-8">
        <TimelineScroller>
        <div
          className="relative mx-10"
          style={{ width: TRACK_PX, height: lineTop + 40 + lanes * LANE_PX, "--line": `${lineTop}px` } as CSSProperties}
        >
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
              className="absolute top-[calc(var(--line)-0.75rem)] h-7 w-0.5 -translate-x-1/2 bg-ink/40"
              style={{ left: `${(px((i + 1) * 12) / TRACK_PX) * 100}%` }}
            />
          ))}
          {/* Cada ano fica centralizado no tracinho onde ele termina, logo acima da linha. */}
          <ol aria-hidden>
            {years.map((year, i) => (
              <li
                key={year}
                className="absolute top-[calc(var(--line)-2rem)] z-10 -translate-x-1/2 bg-paper px-1.5 text-lg font-bold tracking-[-0.02em]"
                style={{ left: `${(px((i + 1) * 12) / TRACK_PX) * 100}%` }}
              >
                {year}
              </li>
            ))}
          </ol>

          <ol>
            {marks.map(({ item, pos, below }, i) => {
              const rank = marks.slice(0, i).filter((m) => m.below === below).length;
              const flip = below ? slots[rank].flip : above[rank].flip;
              const drop = below ? 24 + slots[rank].lane * LANE_PX : 0; // px da linha até a foto
              const height = below ? 0 : levels[rank]; // px, acima da linha
              return (
                <li
                  key={`${item.year}-${item.month}-${item.label.pt}`}
                  className={`timeline-mark absolute ${flip ? "-translate-x-full pr-4 text-right" : "pl-4"} ${
                    below ? "top-[calc(var(--line)+1px)]" : "bottom-[calc(100%-var(--line))]"
                  }`}
                  style={
                    {
                      left: `${pos * 100}%`,
                      height: below ? undefined : height,
                      paddingTop: below ? drop : undefined,
                      // Fileiras de cima por cima: os pontilhados das de baixo passam por trás delas.
                      zIndex: below ? 10 - slots[rank].lane : undefined,
                      "--at": pos / today,
                    } as CSSProperties
                  }
                >
                  {item.photo && (
                    <>
                      {/* Um caminho só: desce da linha, faz a curva e entra no meio da foto
                          (metade da foto w-36 em 4:3 = 54px abaixo do topo dela). */}
                      <MarchingDots
                        length={drop + 66}
                        d={
                          flip
                            ? `M15 0 V${drop + 40} Q15 ${drop + 54} 1 ${drop + 54} H0`
                            : `M1 0 V${drop + 40} Q1 ${drop + 54} 15 ${drop + 54} H16`
                        }
                        className={`top-0 w-4 ${flip ? "right-0" : "left-0"}`}
                        style={{ height: drop + 56 }}
                      />
                      <Image
                        src={item.photo}
                        alt={item.photoAlt?.[lang] ?? ""}
                        width={480}
                        height={360}
                        className={`relative z-10 aspect-[4/3] w-36 rounded-lg object-cover ${flip ? "ml-auto" : ""}`}
                      />
                    </>
                  )}
                  <p className={`font-mono text-sm text-accent-ink ${below ? "relative z-10 mt-2 bg-paper" : ""}`}>
                    {/* Embaixo das fotos estreitas, a data curta (28/06/2025) cabe numa linha. */}
                    {below && item.day && item.month ? shortDate(item, lang) : dateLabel(item, lang)}
                  </p>
                  <p
                    className={`mt-1 font-semibold leading-snug text-balance ${
                      // Fundo sólido: pontilhados das fileiras de baixo passam por trás do texto.
                      below ? "relative z-10 w-36 bg-paper text-sm" : "w-44 text-base"
                    }`}
                  >
                    {item.label[lang]}
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
        </TimelineScroller>
      </div>
    </>
  );
}

const DOT_GAP = 6; // px entre os pontos do pontilhado
const DOT_SPEED = 4; // px por segundo: bem devagar

/**
 * Pontilhado que anda ao longo de `d` (da linha até o marco). Cada ponto desliza
 * pelo caminho com offset-path, que é suave mesmo devagar, e some nas pontas.
 */
function MarchingDots({
  d,
  length,
  className,
  style,
}: {
  d: string;
  length: number;
  className: string;
  style?: CSSProperties;
}) {
  const count = Math.ceil(length / DOT_GAP);
  const duration = length / DOT_SPEED;
  return (
    <span aria-hidden className={`absolute ${className}`} style={style}>
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

export default async function SobrePage() {
  const lang = await getLang();
  const { difference, vision, values, history, support, ...aboutPage } = about[lang];
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <Reveal>
          <h1 className="fade-in text-4xl font-bold tracking-[-0.04em] md:text-6xl">
            {aboutPage.title}
            {/* Desligado: a troca de fontes fazia o layout pular. */}
            {/* <FontCycle text="PUC Tech" className="text-accent-ink" /> */}
          </h1>
          <p className="fade-in mt-6 max-w-3xl text-lg leading-relaxed [animation-delay:250ms] text-pretty text-muted md:text-xl">
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
            {values.items.map((value, index) => (
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
                  {icons[valueIcons[index]]}
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
          <Timeline lang={lang} />
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
                src={supportLogo}
                alt={support.logoAlt}
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
