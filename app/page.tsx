import Image from "next/image";
import Link from "next/link";
import AsciiLogo from "@/components/AsciiLogo";
import { CdLink, container, withBold } from "@/components/Section";
import { socials } from "@/components/SocialIcons";
import {
  about,
  hero,
  partners,
  partnersIntro,
  projectsIntro,
  socialIntro,
  stats,
} from "@/data/home";
import { projectAreas } from "@/data/projects";
import { selectionPage } from "@/data/selection";

// Seções soltas na página, sem caixas: tipografia grande, espaço e poucas linhas.
const display =
  "font-display text-4xl font-bold tracking-[-0.035em] text-balance md:text-6xl md:leading-[1.02]";
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

      {/* Números: logo abaixo da abertura, soltos na página. */}
      <section className={`${container} pb-20 md:pb-28`}>
        <h2 className="sr-only">Nossos números</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-10 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-2 max-w-[18ch] text-[15px] leading-snug text-muted">
                {stat.label}
              </dt>
              <dd className="font-display text-6xl font-bold tracking-[-0.045em] md:text-7xl">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Sobre */}
      <section id="sobre" className={`${container} scroll-mt-20 py-20 md:py-28`}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className={display}>{about.title}</h2>
            <CdLink href="/sobre" className="mt-6" />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted md:text-xl lg:col-span-7">
            {about.paragraphs.map((text) => (
              <p key={text}>{withBold(text)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section id="projetos" className={`${container} scroll-mt-20 py-20 md:py-28`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className={`${display} lg:col-span-5`}>Projetos</h2>
          <div className="lg:col-span-7">
            <p className="max-w-[56ch] text-lg leading-relaxed text-muted md:text-xl">
              {projectsIntro.text}
            </p>
            <CdLink href="/projetos" className="mt-6" />
          </div>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {projectAreas.map((area) => (
            <li key={area.title}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink">
                <Image
                  src={area.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 270px, 50vw"
                  className="object-cover"
                  style={{ objectPosition: area.position }}
                />
              </div>
              <p className="mt-4 font-display text-lg font-bold leading-tight md:text-xl">
                {area.title}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Processo seletivo: a única faixa de cor da home. */}
      <section className="bg-accent">
        <Link
          href="/processo-seletivo"
          className={`${container} group flex flex-col gap-6 py-16 md:flex-row md:items-end md:justify-between md:py-20`}
        >
          <span>
            <span className="block text-lg font-medium">{selectionPage.badge}</span>
            <span className="mt-2 block font-display text-5xl font-bold tracking-[-0.04em] md:text-7xl">
              {selectionPage.title}
            </span>
          </span>
          <span className="font-mono text-sm underline decoration-ink/30 underline-offset-4 group-hover:decoration-ink">
            cd /processo-seletivo
          </span>
        </Link>
      </section>

      {/* Parceiros */}
      <section id="parceiros" className={`${container} scroll-mt-20 py-20 md:py-28`}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className={display}>{partnersIntro.title}</h2>
            <div className="mt-6 space-y-1 text-lg leading-relaxed text-muted">
              {partnersIntro.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 lg:col-span-7 lg:self-center">
            {partners.map((partner) => (
              <li key={partner.name} className="flex flex-col items-center gap-3 text-center">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt=""
                    width={96}
                    height={96}
                    className="size-20 rounded-xl object-cover md:size-24"
                  />
                ) : null}
                <span className="text-sm text-muted">{partner.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Redes */}
      <section id="redes" className={`${container} scroll-mt-20 border-t border-border py-20 md:py-28`}>
        <h2 className={display}>{socialIntro.title}</h2>
        <p className="mt-4 text-lg font-semibold">{socialIntro.tagline}</p>
        <p className="mt-1 max-w-[56ch] text-lg leading-relaxed text-muted">{socialIntro.text}</p>
        <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-display text-2xl font-bold tracking-[-0.02em] md:text-3xl"
              >
                <Icon className="size-6 text-accent-ink" />
                <span className="underline decoration-transparent decoration-2 underline-offset-8 transition-colors group-hover:decoration-accent">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
