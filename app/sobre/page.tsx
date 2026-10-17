import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { Heading, Stage, withBold } from "@/components/Section";
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

// Mesmo ritmo da home: título, texto logo abaixo e o conteúdo.
const gap = "py-12 md:py-16";

export default function SobrePage() {
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <Reveal>
          <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">{aboutPage.title}</h1>
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
              {withBold(vision.text)}
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

      <Stage id="historia" className={gap}>
        <Heading title={history.title} wide>
          {history.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </Heading>
        <Reveal delay={150}>
          {/* A linha segue depois do último marco e some: a história continua. */}
          <ol className="relative mt-12 grid grid-cols-3 md:grid-cols-4">
            <span
              aria-hidden
              className="absolute inset-x-0 top-1.5 h-0.5 bg-gradient-to-r from-accent from-75% to-transparent md:from-60%"
            />
            {history.milestones.map((item) => (
              <li key={item.year} className="relative pr-4">
                <span aria-hidden className="block size-3.5 rounded-full border-2 border-accent bg-paper" />
                <p className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl md:text-6xl">{item.year}</p>
                <ul className="mt-2 space-y-1 text-[15px] leading-snug text-pretty text-muted">
                  {item.events.map((event) => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
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
