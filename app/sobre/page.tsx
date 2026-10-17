import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Heading, Stage } from "@/components/Section";
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
            <p className="mt-3 max-w-5xl text-2xl leading-snug font-bold tracking-[-0.025em] text-balance md:text-4xl">
              {vision.text}
            </p>
          </div>
        </Reveal>
      </Stage>

      <Stage id="diferenca" className={gap}>
        <Heading title={difference.title} />
        <Reveal delay={150}>
          <ol className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {difference.items.map((item, index) => (
              <li key={item.title}>
                <p className="font-mono text-sm text-accent-ink">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-xl font-semibold leading-snug">{item.title}</p>
                <p className="mt-2 leading-relaxed text-pretty text-muted">{item.text}</p>
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
              <li key={value.title}>
                <span aria-hidden className="block h-0.5 w-8 bg-accent" />
                <p className="mt-4 font-semibold leading-snug">{value.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{value.text}</p>
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
          <ul className="mt-10 flex flex-wrap gap-x-16 gap-y-6">
            {history.milestones.map((item) => (
              <li key={item.year}>
                <p className="text-5xl font-bold tracking-[-0.04em] md:text-6xl">{item.year}</p>
                <p className="mt-1 font-mono text-sm text-accent-ink">{item.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>

      <Stage id="apoio" className="pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          <div className="min-w-0 flex-1">
            <Heading title={support.title} wide>
              {support.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </Heading>
          </div>
          <Reveal delay={150}>
            <Image
              src={support.logo}
              alt="Logo da PUC-SP"
              width={128}
              height={128}
              className="size-24 shrink-0 rounded-2xl object-cover md:size-28"
            />
          </Reveal>
        </div>
      </Stage>
    </main>
  );
}
