import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { Heading, Stage, button, withBold } from "@/components/Section";
import { ExternalIcon } from "@/components/SocialIcons";
import { applyUrl, cs50, selection } from "@/data/selection";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = selection[lang];
  return { title: t.title, description: t.description };
}

const { video } = cs50;

export default async function ProcessoSeletivoPage() {
  const lang = await getLang();
  const selectionPage = selection[lang];
  const { prepare } = selectionPage;
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <p className="fade-in flex items-center gap-2.5 font-mono text-sm text-accent-ink">
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          {selectionPage.badge}
        </p>
        <h1 className="fade-in mt-5 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{selectionPage.title}</h1>
        <p className="fade-in mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-muted [animation-delay:250ms] md:text-xl [&_strong]:text-ink">
          {withBold(selectionPage.intro)}
        </p>
      </Stage>

      <Stage id="como-se-preparar" className="py-12 md:py-16">
        <Heading title={prepare.title}>
          <p>{withBold(prepare.text)}</p>
        </Heading>
        <Reveal delay={150}>
          {/* O vídeo toca aqui mesmo; youtube-nocookie não grava cookies até a pessoa dar play. */}
          <div className="mt-10 aspect-video overflow-hidden rounded-2xl bg-surface">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?list=${video.playlist}&rel=0&modestbranding=1`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="size-full"
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-sm text-muted">{video.title} · Harvard</p>
            <a
              href={cs50.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.base} ${button.outline}`}
            >
              {prepare.linkLabel}
              <ExternalIcon className="size-4" />
            </a>
          </div>
        </Reveal>
      </Stage>

      {/* Inscrição: a faixa de cor, como na home. */}
      <Stage className="mt-12 bg-accent text-on-accent md:mt-16">
        <Reveal>
          <div className="flex flex-col gap-8 py-14 md:flex-row md:items-end md:justify-between md:py-20">
            <p className="max-w-2xl text-3xl font-bold tracking-[-0.035em] text-balance md:text-5xl">
              {selectionPage.badge}
            </p>
            {applyUrl ? (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${button.base} bg-ink text-paper hover:bg-paper hover:text-ink`}
              >
                {selectionPage.applyLabel}
                <ExternalIcon className="size-4" />
              </a>
            ) : (
              <span className="rounded-full border border-dashed border-on-accent/40 px-5 py-2.5 font-mono text-sm">
                {selectionPage.soonLabel}
              </span>
            )}
          </div>
        </Reveal>
      </Stage>
    </main>
  );
}
