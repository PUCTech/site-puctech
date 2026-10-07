import type { Metadata } from "next";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Section from "@/components/Section";
import { projectAreas, projects, projectsPage } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Conheça os projetos da PUC Tech: inteligência artificial, engenharia de software, cibersegurança e dados, sempre com foco em impacto real.",
};

export default function ProjetosPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,#143966_0%,transparent_100%)] opacity-70"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            {projectsPage.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-brand-200/90">
            {projectsPage.intro}
          </p>
        </div>
      </section>

      <Section id="areas" title="Áreas de Atuação">
        <div className="grid gap-4 sm:grid-cols-2">
          {projectAreas.map((area, index) => (
            <div key={area.title} className="rounded-2xl bg-paper p-6 md:p-8">
              <p className="text-sm font-semibold text-brand-500">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-brand-950">
                {area.title}
              </h3>
              <p className="mt-3 text-brand-800">{area.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="projetos" title="Nossos projetos">
        {projects.length > 0 ? (
          <ProjectsShowcase projects={projects} />
        ) : (
          <p className="max-w-2xl text-lg text-brand-200/90">
            Em breve, os projetos da PUC Tech vão aparecer aqui.
          </p>
        )}
      </Section>
    </main>
  );
}