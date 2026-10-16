import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import AsciiLogo from "@/components/AsciiLogo";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import { CdLink, Stage, withBold } from "@/components/Section";
import { socials } from "@/components/SocialIcons";
import {
  about,
  hero,
  partners,
  partnersIntro,
  projectsIntro,
  socialIntro,
} from "@/data/home";
import { projectAreas } from "@/data/projects";
import { selectionPage } from "@/data/selection";

// Todas as seções seguem o mesmo ritmo: título, texto logo abaixo e o conteúdo.
const gap = "py-14 md:py-20";

function Heading({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="max-w-[62ch]">
      <h2 className="text-3xl font-bold tracking-[-0.03em] text-balance md:text-5xl md:leading-[1.05]">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-lg leading-relaxed text-muted">{children}</div>
      {href && <CdLink href={href} className="mt-5" />}
    </Reveal>
  );
}

export default function Home() {
  return (
    <main>
      {/* Abertura: a chuva de caracteres ocupa a tela toda. */}
      <section className="relative h-[calc(100svh-4rem)] max-h-[60rem] min-h-[28rem]">
        <AsciiLogo className="absolute inset-0">
          <h1>
            <span className="sr-only">PUC Tech: </span>
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-base font-medium tracking-[-0.01em] text-balance text-muted md:text-xl">
              {hero.title}
            </span>
          </h1>
        </AsciiLogo>
      </section>

      {/* Números: logo abaixo da abertura, com respiro em cima. */}
      <Stage className="pt-16 pb-14 md:pt-28 md:pb-20">
        <h2 className="sr-only">Nossos números</h2>
        <Stats />
      </Stage>

      <Stage id="sobre" className={gap}>
        <Heading title={about.title} href="/sobre">
          {about.paragraphs.map((text) => (
            <p key={text}>{withBold(text)}</p>
          ))}
        </Heading>
      </Stage>

      <Stage id="projetos" className={gap}>
        <Heading title="Projetos" href="/projetos">
          <p>{projectsIntro.text}</p>
        </Heading>
        <Reveal delay={150}>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {projectAreas.map((area) => (
              <li key={area.title} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink">
                  <Image
                    src={area.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 270px, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    style={{ objectPosition: area.position }}
                  />
                </div>
                <p className="mt-3 font-semibold leading-snug">{area.title}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>

      {/* Processo seletivo: a única faixa de cor da home. */}
      <Stage className="bg-accent">
        <Reveal>
          <Link
            href="/processo-seletivo"
            className="group flex flex-col gap-4 py-14 md:flex-row md:items-end md:justify-between md:py-16"
          >
            <span>
              <span className="block font-medium">{selectionPage.badge}</span>
              <span className="mt-1 block text-4xl font-bold tracking-[-0.035em] md:text-6xl">
                {selectionPage.title}
              </span>
            </span>
            <span className="font-mono text-sm underline decoration-ink/30 underline-offset-4 group-hover:decoration-ink">
              cd /processo-seletivo
            </span>
          </Link>
        </Reveal>
      </Stage>

      <Stage id="parceiros" className={gap}>
        <Heading title={partnersIntro.title}>
          {partnersIntro.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </Heading>
        <Reveal delay={150}>
          <ul className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            {partners.map((partner) => (
              <li key={partner.name} className="flex flex-col items-start gap-3">
                {partner.logo && (
                  <Image
                    src={partner.logo}
                    alt=""
                    width={96}
                    height={96}
                    className="size-20 rounded-xl object-cover md:size-24"
                  />
                )}
                <span className="text-sm text-muted">{partner.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>

      <Stage id="redes" className={gap}>
        <Heading title={socialIntro.title}>
          <p className="font-semibold text-ink">{socialIntro.tagline}</p>
          <p>{socialIntro.text}</p>
        </Heading>
        <Reveal delay={150}>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 text-xl font-semibold md:text-2xl"
                >
                  <Icon className="size-5 text-accent-ink" />
                  <span className="underline decoration-transparent decoration-2 underline-offset-8 transition-colors group-hover:decoration-accent">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>
    </main>
  );
}
