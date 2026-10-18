import Link from "next/link";
import { Notice } from "@/components/admin/forms";
import { projectStatuses } from "@/data/projects";
import { button } from "@/components/Section";
import { loadProjects } from "@/lib/admin-data";

export default async function AdminProjects({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [{ ok }, projects] = await Promise.all([searchParams, loadProjects()]);

  return (
    <>
      <Notice ok={ok} />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-5xl">Projetos</h1>
          <p className="mt-3 text-lg text-muted">
            {projects.length} {projects.length === 1 ? "projeto" : "projetos"} no site.
          </p>
        </div>
        <Link href="/admin/projetos/novo" className={`${button.base} ${button.primary}`}>
          Novo projeto
        </Link>
      </div>

      <ol className="mt-10 border-b border-border">
        {projects.map(({ project }, index) => (
          <li key={project.slug} className="border-t border-border">
            <Link
              href={`/admin/projetos/${project.slug}`}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-6 py-6"
            >
              <span className="font-mono text-sm text-accent-ink">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-xl font-bold tracking-[-0.02em] underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-accent">
                  {project.title}
                </span>
                <span className="mt-1 block font-mono text-sm text-muted">
                  /projetos/{project.slug}
                  {[project.area, projectStatuses.find((s) => s.id === project.status)?.label].filter(Boolean).map((item) => ` · ${item}`)}
                </span>
              </span>
              <span className="font-mono text-sm text-muted group-hover:text-ink">editar →</span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
