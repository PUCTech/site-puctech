import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectDetails from "@/components/ProjectDetails";
import { getProject, getProjects } from "@/lib/projects";

// Só existem as páginas dos projetos cadastrados em content/projetos/.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary ?? project.description.split("\n\n")[0],
  };
}

export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main>
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/projetos#projetos"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-200/80 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> Todos os projetos
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl bg-paper text-brand-950">
            <ProjectDetails
              project={project}
              titleId="titulo-do-projeto"
              titleAs="h1"
            />
          </article>
        </div>
      </section>
    </main>
  );
}