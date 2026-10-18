import Image from "next/image";
import Link from "next/link";
import { areaName, projectsPage, projectStatuses, type Project, type ProjectStatus } from "@/data/projects";
import type { Lang } from "@/lib/i18n";

const statusName = (id: ProjectStatus | undefined, lang: Lang) =>
  projectStatuses.find((item) => item.id === id)?.name[lang];

/** Área · status · período, no idioma da página. */
export const projectMeta = (project: Project, lang: Lang) =>
  [areaName(project.area, lang), statusName(project.status, lang), project.period].filter(Boolean).join(" · ");

/** Lista de projetos; cada um leva para a sua página (/projetos/slug). */
export default function ProjectsShowcase({ projects, lang }: { projects: Project[]; lang: Lang }) {
  if (projects.length === 0) {
    return <p className="text-lg text-muted">{projectsPage[lang].empty}</p>;
  }

  return (
    <ol className="border-b border-border">
      {projects.map((project, index) => (
        <li key={project.slug} className="border-t border-border">
          <Link
            href={`/projetos/${project.slug}`}
            className="group grid grid-cols-[2.5rem_1fr] gap-y-6 py-14 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-10 md:py-20"
          >
            <span className="pt-3 font-mono text-sm text-accent-ink">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-balance underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-accent md:text-5xl">
                {project.title}
                <span
                  aria-hidden
                  className="ml-3 inline-block text-accent-ink opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                >
                  →
                </span>
              </h2>
              {project.summary && (
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted md:text-xl">
                  {project.summary}
                </p>
              )}
              <p className="mt-8 font-mono text-sm text-muted">
                {projectMeta(project, lang)}
              </p>
              {project.tech && project.tech.length > 0 && (
                <p className="mt-2 font-mono text-sm leading-relaxed text-accent-ink">{project.tech.join(" / ")}</p>
              )}
            </div>
            {project.image && (
              <div className="relative col-start-2 aspect-[16/10] w-full overflow-hidden rounded-2xl sm:col-start-3 sm:row-start-1 sm:w-72 md:w-[26rem]">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 416px, (min-width: 640px) 288px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
