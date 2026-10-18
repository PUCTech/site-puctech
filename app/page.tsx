import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import AreaIcon from "@/components/AreaIcon";
import AsciiLogo from "@/components/AsciiLogo";
import LogoMarquee from "@/components/LogoMarquee";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import { Heading, Stage, withBold } from "@/components/Section";
import { socials } from "@/components/SocialIcons";
import { hiredAt, home, partners, stats } from "@/data/home";
import { projectAreas } from "@/data/projects";
import { selection } from "@/data/selection";
import { getLang } from "@/lib/lang";

// Empresas que contrataram membros: altura (px, no desktop) dos logos de cada faixa, e quanto
// a mais ganham os que não são horizontais, para parecerem do tamanho dos outros da faixa.
// No celular cada faixa quebra num ponto fixo (`mobileBreak` logos na primeira linha), para
// nunca sobrar um logo sozinho: a de cima fica 2 + 3, a de baixo 3 + 2.
const tiers = [1, 2] as const;
const tierHeight = { 1: { desktop: 56, mobile: 34 }, 2: { desktop: 30, mobile: 22 } };
const mobileBreak = { 1: 2, 2: 3 };
const shapeScale = { square: 1.1, stacked: 1.7 };

// Todas as seções seguem o mesmo ritmo: título, texto logo abaixo e o conteúdo.
const gap = "py-12 md:py-16";

export default async function Home() {
  const lang = await getLang();
  const { hero, numbers, hiredTitle, about, statLabels, projectsIntro, partnersIntro, socialIntro } = home[lang];
  const selectionPage = selection[lang];
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
        <h2 className="sr-only">{numbers}</h2>
        <Stats stats={stats.map((stat, i) => ({ ...stat, label: statLabels[i] }))} />

        {/* Onde a liga já colocou gente, logo depois do "estudantes empregados". Como numa
            parede de patrocinadores: uma faixa por tamanho de empresa, logos maiores em cima. */}
        <Reveal delay={150}>
          <div className="mt-16 border-t border-border pt-8 md:mt-20">
            <h3 className="text-center font-mono text-sm text-muted">{hiredTitle}</h3>
            <div className="mt-10 flex flex-col items-center gap-10 md:gap-12">
              {tiers.map((tier) => (
                <ul key={tier} className="flex flex-wrap items-center justify-center gap-x-7 gap-y-6 md:gap-x-16">
                  {hiredAt
                    .filter((company) => company.tier === tier)
                    .map((company, index) => (
                      <Fragment key={company.name}>
                        {index === mobileBreak[tier] && <li aria-hidden className="h-0 basis-full md:hidden" />}
                        <li>
                          <a
                            href={company.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={company.name}
                            className="block opacity-90 transition-opacity hover:opacity-100"
                            style={
                              {
                                "--h": `${tierHeight[tier].desktop * (company.shape ? shapeScale[company.shape] : 1)}px`,
                                "--hm": `${tierHeight[tier].mobile * (company.shape ? shapeScale[company.shape] : 1)}px`,
                              } as CSSProperties
                            }
                          >
                            {[
                              { src: company.logo, className: company.logoDark ? "dark:hidden" : "", alt: company.name },
                              ...(company.logoDark ? [{ src: company.logoDark, className: "hidden dark:block", alt: "" }] : []),
                            ].map((logo) => (
                              <Image
                                key={logo.src}
                                src={logo.src}
                                alt={logo.alt}
                                width={320}
                                height={96}
                                className={`h-(--hm) w-auto object-contain md:h-(--h) ${logo.className}`}
                              />
                            ))}
                          </a>
                        </li>
                      </Fragment>
                    ))}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>
      </Stage>

      <Stage id="sobre" className={gap}>
        <Heading title={about.title} href={"/sobre"} wide>
          {about.paragraphs.map((text) => (
            <p key={text}>{withBold(text)}</p>
          ))}
        </Heading>
      </Stage>

      <Stage id="projetos" className={gap}>
        <Heading title={projectsIntro.title} href={"/projetos"}>
          <p>{projectsIntro.text}</p>
        </Heading>
        <Reveal delay={150}>
          <ul className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {projectAreas.map((area) => (
              <li key={area.title}>
                <AreaIcon title={area.title} className="size-7 text-accent-ink" />
                <p className="mt-4 font-semibold leading-snug">{area.name[lang]}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-pretty text-muted">{area.text[lang]}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>

      {/* Processo seletivo: a única faixa de cor da home. */}
      <Stage className="bg-accent text-on-accent">
        <Reveal>
          <Link
            href={"/processo-seletivo"}
            className="group flex flex-col gap-4 py-14 md:flex-row md:items-end md:justify-between md:py-16"
          >
            <span>
              <span className="block font-medium">{selectionPage.badge}</span>
              <span className="mt-1 block text-4xl font-bold tracking-[-0.035em] md:text-6xl">
                {selectionPage.title}
              </span>
            </span>
            <span className="font-mono text-sm underline decoration-on-accent/30 underline-offset-4 group-hover:decoration-on-accent">
              cd {"/processo-seletivo"}
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
            {socials(lang).map(({ label, href, Icon }) => (
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
