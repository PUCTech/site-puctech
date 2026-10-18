import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { statusLabel } from "@/components/ProjectsShowcase";
import Reveal from "@/components/Reveal";
import { CdLink, Stage, button } from "@/components/Section";
import { getProject, getProjects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.summary ?? project.description };
}

// Texto do .md: linha em branco separa os parágrafos.
const paragraphs = (text: string) => text.split("\n\n").map((p) => <p key={p}>{p}</p>);

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const sections = [
    { title: "Sobre o projeto", text: project.description },
    { title: "Objetivo e escopo", text: project.objective },
    { title: "Resultados e aprendizados", text: project.results },
  ].filter((section) => section.text);

  return (
    <main>
      <Stage className="pt-12 pb-12 md:pt-20 md:pb-16">
        <CdLink href="/projetos" />
        <p className="fade-in mt-10 font-mono text-sm text-accent-ink">
          {[project.area, statusLabel(project.status), project.period].filter(Boolean).join(" · ")}
        </p>
        <h1 className="fade-in mt-3 text-4xl font-bold tracking-[-0.04em] text-balance md:text-7xl">
          {project.title}
        </h1>
        {project.summary && (
          <p className="fade-in mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-muted [animation-delay:250ms] md:text-2xl">
            {project.summary}
          </p>
        )}
      </Stage>

      {project.image && (
        <Stage>
          <Reveal>
            <div className="relative aspect-[16/10] max-w-3xl overflow-hidden rounded-2xl">
              <Image
                src={project.image}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Stage>
      )}

      {/* Texto à esquerda; ficha (stack, equipe, repositório) fixa à direita no desktop. */}
      <Stage className="py-12 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_18rem] lg:gap-20">
          <div className="max-w-2xl space-y-14">
            {sections.map((section) => (
              <Reveal key={section.title}>
                <section>
                  <h2 className="text-2xl font-bold tracking-[-0.03em] md:text-3xl">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-lg leading-relaxed text-pretty text-muted">
                    {paragraphs(section.text!)}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
            {project.tech && project.tech.length > 0 && (
              <div>
                <h2 className="font-mono text-sm text-muted">stack</h2>
                <ul className="mt-3 space-y-1.5 font-mono text-[15px] text-accent-ink">
                  {project.tech.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.team && project.team.length > 0 && (
              <div>
                <h2 className="font-mono text-sm text-muted">equipe</h2>
                <ul className="mt-3 space-y-1.5 font-semibold">
                  {project.team.map((person) => (
                    <li key={person}>{person}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={`${button.base} ${button.primary}`}
              >
                Ver repositório ↗
              </a>
            )}
          </aside>
        </div>
      </Stage>

      {projects.length > 1 && (
        <Stage className="pb-20 md:pb-28">
          <Link href={`/projetos/${next.slug}`} className="group block border-t border-border pt-10">
            <span className="font-mono text-sm text-muted">próximo projeto</span>
            <span className="mt-2 block text-3xl font-bold tracking-[-0.03em] underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-accent md:text-5xl">
              {next.title} <span className="text-accent-ink transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Stage>
      )}
    </main>
  );
}
