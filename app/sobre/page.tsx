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
function Timeline() {
  // Posição de 0 a 1 na linha: no dia do marco, ou no meio do mês se não tiver dia.
  const at = (year: number, month = 1, day?: number) =>
    ((year - firstYear) * 12 + month - 1 + (day ? day / 31 : 0.5)) / (years.length * 12);
  const now = new Date();
  const today = at(now.getFullYear(), now.getMonth() + 1);

  return (
    <>
      {/* Marcos sem foto ficam acima da linha; os com foto, abaixo. */}
      {/* No desktop a linha usa a largura toda da janela (com um limite em telas enormes). */}
      <div className="relative left-1/2 mt-14 hidden w-screen -translate-x-1/2 px-8 md:block lg:px-12">
        <div className="relative mx-auto h-[27rem] max-w-[110rem]">
          {/* Até hoje a linha é cheia; o resto do ano atual fica apagado. */}
          <span aria-hidden className="absolute inset-x-0 top-40 h-0.5 bg-border" />
          <span
            aria-hidden
            className="timeline-line absolute left-0 top-40 h-0.5 bg-accent"
            style={{ width: `${today * 100}%` }}
          />
          {years.slice(1).map((year, i) => (
            <span
              key={year}
              aria-hidden
              className="absolute top-38 h-5 w-px bg-border"
              style={{ left: `${((i + 1) / years.length) * 100}%` }}
            />
          ))}
          <ol aria-hidden className="absolute inset-x-0 top-42 flex">
            {years.map((year, i) => (
              <li
                key={year}
                className={`flex-1 text-2xl font-bold tracking-[-0.03em] ${
                  i === 0 ? "text-left" : i === years.length - 1 ? "text-right" : "text-center"
                }`}
              >
                {year}
              </li>
            ))}
          </ol>

          <ol>
            {history.milestones.map((item, i) => {
              const pos = at(item.year, item.month, item.day);
              const below = Boolean(item.photo);
              // Posição entre os marcos do mesmo lado, para alternar as alturas.
              const rank = history.milestones.slice(0, i).filter((m) => Boolean(m.photo) === below).length;
              // Texto vai para a esquerda perto da ponta direita; as fotos, já da metade em diante.
              const flip = pos > (below ? 0.5 : 0.75);
              return (
                <li
                  key={item.label}
                  className={`timeline-mark absolute border-dotted border-accent ${
                    flip ? "-translate-x-full border-r-2 pr-4 text-right" : "border-l-2 pl-4"
                  } ${
                    // Acima, alturas alternadas para os textos vizinhos não se tocarem.
                    below ? "top-[calc(10rem+1px)] pt-12" : `bottom-[calc(100%-10rem)] ${rank % 2 ? "h-24" : "h-40"}`
                  }`}
                  style={{ left: `${pos * 100}%`, "--at": pos / today } as CSSProperties}
                >
                  <p className="font-mono text-sm text-accent-ink">{dateLabel(item)}</p>
                  <p className={`mt-1 font-semibold leading-snug text-balance ${below ? "w-60" : "w-44"}`}>
                    {item.label}
                  </p>
                  {item.photo && (
                    <Image
                      src={item.photo}
                      alt={item.photoAlt ?? ""}
                      width={480}
                      height={360}
                      className={`mt-3 aspect-[4/3] w-60 rounded-xl object-cover ${flip ? "ml-auto" : ""}`}
                    />
                  )}
                  <span
                    aria-hidden
                    className={`absolute size-3 rounded-full bg-accent ring-4 ring-paper ${
                      below ? "-top-[7px]" : "-bottom-[7px]"
                    } ${flip ? "-right-[7px]" : "-left-[7px]"}`}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <ol className="relative mt-12 grid grid-cols-3 md:hidden">
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

// Mesmo ritmo da home: título, texto logo abaixo e o conteúdo.
const gap = "py-12 md:py-16";

export default function SobrePage() {
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <Reveal>
          <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
            {aboutPage.title}
            {/* Desligado: a troca de fontes fazia o layout pular. */}
            {/* <FontCycle text="PUC Tech" className="text-accent-ink" /> */}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-pretty text-muted md:text-2xl">
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
          <p className="mt-12 text-muted">{support.backersIntro}</p>
          <ul className="mt-4 grid gap-x-10 gap-y-6 sm:grid-cols-3">
            {support.backers.map((name) => (
              <li key={name} className="border-t-2 border-accent pt-4 text-lg font-semibold leading-snug text-balance">
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-pretty text-muted">{support.closing}</p>
        </Reveal>
      </Stage>
    </main>
  );
}
