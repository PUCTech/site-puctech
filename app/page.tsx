import Image from "next/image";
import Link from "next/link";
import AsciiLogo from "@/components/AsciiLogo";
import { button, container, h2, withBold } from "@/components/Section";
import { ExternalIcon, socials } from "@/components/SocialIcons";
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

// A home é uma grade de blocos (bento). Cada bloco é uma parte da liga.
export default function Home() {
  return (
    <main>
      {/* Abertura: a chuva de caracteres ocupa a tela toda. */}
      <section className="relative h-[calc(100svh-4rem)] min-h-[28rem]">
        <AsciiLogo className="absolute inset-0">
          <h1>
            <span className="sr-only">PUC Tech: </span>
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-base font-medium tracking-[-0.01em] text-balance text-muted md:text-xl">
              {hero.title}
            </span>
          </h1>
        </AsciiLogo>
      </section>

      <div className={`${container} grid gap-4 py-6 md:py-10 lg:grid-cols-12`}>
      {/* Números */}
      <section className="tile bg-accent lg:col-span-12">
        <h2 className="font-semibold">Nossos números</h2>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-1 max-w-[18ch] text-sm leading-snug">{stat.label}</dt>
              <dd className="font-display text-5xl font-bold tracking-[-0.04em]">
                {stat.value}
                {stat.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Sobre */}
      <section id="sobre" className="tile scroll-mt-24 border border-border lg:col-span-7">
        <h2 className={h2}>{about.title}</h2>
        <div className="mt-5 space-y-4 leading-relaxed text-muted">
          {about.paragraphs.map((text) => (
            <p key={text}>{withBold(text)}</p>
          ))}
        </div>
      </section>

      {/* Processo seletivo */}
      <Link
        href="/processo-seletivo"
        className="tile group flex flex-col justify-between gap-10 bg-ink text-white transition-colors hover:bg-[#0a2247] lg:col-span-5"
      >
        <span className="inline-flex size-12 items-center justify-center self-end rounded-full bg-accent text-ink transition-transform group-hover:rotate-45">
          <ExternalIcon className="size-5" />
        </span>
        <span>
          <span className="block font-display text-3xl font-bold tracking-[-0.02em] md:text-4xl">
            {selectionPage.title}
          </span>
          <span className="mt-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">
            {selectionPage.badge}
          </span>
        </span>
      </Link>

      {/* Projetos */}
      <section id="projetos" className="tile scroll-mt-24 bg-surface lg:col-span-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={h2}>Projetos</h2>
            <p className="mt-3 max-w-[56ch] leading-relaxed text-muted">
              {projectsIntro.text}
            </p>
          </div>
          <Link href="/projetos" className={`${button.base} ${button.primary} shrink-0`}>
            Conheça nossos projetos
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {projectAreas.map((area) => (
            <li
              key={area.title}
              className="relative flex aspect-[4/5] items-end overflow-hidden rounded-[1.5rem] bg-ink p-4 sm:aspect-[4/3] lg:aspect-[4/5]"
            >
              <Image
                src={area.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 260px, 50vw"
                className="object-cover"
                style={{ objectPosition: area.position }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/30 to-transparent"
              />
              <p className="relative font-semibold text-white">{area.title}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Parceiros */}
      <section id="parceiros" className="tile scroll-mt-24 border border-border lg:col-span-8">
        <h2 className={h2}>{partnersIntro.title}</h2>
        <div className="mt-3 space-y-1 leading-relaxed text-muted">
          {partnersIntro.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <ul className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-7 lg:grid-cols-4 xl:grid-cols-7">
          {partners.map((partner) => (
            <li
              key={partner.name}
              className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border"
            >
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={120}
                  className="size-full object-cover"
                />
              ) : (
                <span className="px-2 text-center text-xs font-semibold">
                  {partner.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Redes */}
      <section id="redes" className="tile scroll-mt-24 bg-surface lg:col-span-4">
        <h2 className={h2}>{socialIntro.title}</h2>
        <p className="mt-3 font-semibold">{socialIntro.tagline}</p>
        <p className="mt-1 leading-relaxed text-muted">{socialIntro.text}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
              >
                <Icon className="size-4" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
