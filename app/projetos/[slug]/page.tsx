import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectMeta } from "@/components/ProjectsShowcase";
import Reveal from "@/components/Reveal";
import { CdLink, Stage, button } from "@/components/Section";
import { projectsPage } from "@/data/projects";
import type { Member } from "@/data/team";
import { getAllMembers, getProject, getProjects } from "@/lib/content";
import { getLang } from "@/lib/lang";

type Props = PageProps<"/projetos/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await getLang();
  const { slug } = await params;
  const project = await getProject(slug, lang);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary ?? project.description,
  };
}

// Nome na equipe do projeto -> pessoa da lista de membros (inclusive quem já saiu),
// para mostrar foto e LinkedIn. Compara sem acento nem maiúsculas.
const plain = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
// Se o nome não bater inteiro ("Liam Vedovato Lopes" x "Liam Lopes"), aceita o mesmo
// primeiro e último nome, desde que só uma pessoa tenha essa combinação.
const ends = (text: string) => {
  const words = plain(text).split(/\s+/);
  return `${words[0]} ${words.at(-1)}`;
};
const memberNamed = (allMembers: Member[], name: string) => {
  const exact = allMembers.find((m) => plain(m.name) === plain(name));
  if (exact) return exact;
  const close = allMembers.filter((m) => ends(m.name) === ends(name));
  return close.length === 1 ? close[0] : undefined;
};

// Texto do .md: linha em branco separa os parágrafos.
const paragraphs = (text: string) => text.split("\n\n").map((p) => <p key={p}>{p}</p>);

export default async function ProjectPage({ params }: Props) {
  const lang = await getLang();
  const { slug } = await params;
  const t = projectsPage[lang];
  const [projects, allMembers] = await Promise.all([getProjects(lang), getAllMembers()]);
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const sections = [
    { title: t.sections.description, text: project.description },
    { title: t.sections.objective, text: project.objective },
    { title: t.sections.results, text: project.results },
  ].filter((section) => section.text);

  return (
    <main>
      <Stage className="pt-12 pb-12 md:pt-20 md:pb-16">
        <CdLink href={"/projetos"} />
        <p className="fade-in mt-10 font-mono text-sm text-accent-ink">
          {projectMeta(project, lang)}
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
                <h2 className="font-mono text-sm text-muted">{t.stack}</h2>
                <ul className="mt-3 space-y-1.5 font-mono text-[15px] text-accent-ink">
                  {project.tech.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.team && project.team.length > 0 && (
              <div>
                <h2 className="font-mono text-sm text-muted">{t.team}</h2>
                <ul className="mt-4 space-y-3">
                  {project.team.map((name) => {
                    const member = memberNamed(allMembers, name);
                    const content = (
                      <>
                        {member?.photo ? (
                          <Image src={member.photo} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />
                        ) : (
                          <span aria-hidden className="size-10 shrink-0 rounded-full bg-surface" />
                        )}
                        <span className="font-semibold leading-snug underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-accent">
                          {member?.name ?? name}
                        </span>
                      </>
                    );
                    return (
                      <li key={name}>
                        {member?.linkedin ? (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3"
                          >
                            {content}
                          </a>
                        ) : (
                          <div className="flex items-center gap-3">{content}</div>
                        )}
                      </li>
                    );
                  })}
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
                {t.repo} ↗
              </a>
            )}
          </aside>
        </div>
      </Stage>

      {projects.length > 1 && (
        <Stage className="pb-20 md:pb-28">
          <Link href={`/projetos/${next.slug}`} className="group block border-t border-border pt-10">
            <span className="font-mono text-sm text-muted">{t.next}</span>
            <span className="mt-2 block text-3xl font-bold tracking-[-0.03em] underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-accent md:text-5xl">
              {next.title} <span className="text-accent-ink transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Stage>
      )}
    </main>
  );
}
