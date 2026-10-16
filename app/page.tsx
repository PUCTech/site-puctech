import Link from "next/link";
import type { ReactNode } from "react";
import AreaIcon from "@/components/AreaIcon";
import AsciiLogo from "@/components/AsciiLogo";
import LogoMarquee from "@/components/LogoMarquee";
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
const gap = "py-12 md:py-16";

function Heading({
  title,
  href,
  wide = false,
  children,
}: {
  title: string;
  href?: string;
  wide?: boolean; // texto em duas colunas, ocupando a largura toda
  children: ReactNode;
}) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <h2 className="text-3xl font-bold tracking-[-0.03em] text-balance md:text-5xl md:leading-[1.05]">
          {title}
        </h2>
        {href && <CdLink href={href} />}
      </div>
      <div
        className={`mt-4 text-lg leading-relaxed text-pretty text-muted ${
          wide ? "gap-12 space-y-3 md:columns-2 md:space-y-0 [&>p]:break-inside-avoid md:[&>p+p]:mt-0" : "max-w-3xl space-y-3"
        }`}
      >
        {children}
      </div>
    </Reveal>
  );
}

export default function Home() {
  return (
    <main>
      {/* Abertura: a chuva de caracteres ocupa a tela toda. */}
      <section className="relative h-[calc(100svh-4rem)] max-h-[60rem] min-h-[28rem]">
        <h1 className="sr-only">PUC Tech: {hero.title}</h1>
        <AsciiLogo
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]"
          tagline={hero.title}
        />
      </section>

      {/* Números: logo abaixo da abertura, com respiro em cima. */}
      <Stage className="pt-16 pb-14 md:pt-28 md:pb-20">
        <h2 className="sr-only">Nossos números</h2>
        <Stats />
      </Stage>

      <Stage id="sobre" className={gap}>
        <Heading title={about.title} href="/sobre" wide>
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
          <ul className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {projectAreas.map((area) => (
              <li key={area.title}>
                <AreaIcon title={area.title} className="size-7 text-accent-ink" />
                <p className="mt-4 font-semibold leading-snug">{area.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-pretty text-muted">{area.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>

      {/* Processo seletivo: a única faixa de cor da home. */}
      <Stage className="bg-accent text-on-accent">
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
            <span className="font-mono text-sm underline decoration-on-accent/30 underline-offset-4 group-hover:decoration-on-accent">
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
          <div className="mt-10">
            <LogoMarquee partners={partners} />
          </div>
        </Reveal>
      </Stage>

      <Stage id="redes" className={gap}>
        <Heading title={socialIntro.title}>
          <p className="font-semibold text-ink">{socialIntro.tagline}</p>
          <p>{socialIntro.text}</p>
        </Heading>
        <Reveal delay={150}>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
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
