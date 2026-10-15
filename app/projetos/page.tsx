import type { Metadata } from "next";
import Image from "next/image";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Section from "@/components/Section";
import { projectAreas, projects, projectsPage } from "@/data/projects";
import ProjectsGallery from "@/components/ProjectsGallery";

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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projectAreas.map((area, index) => (
            <div
              key={area.title}
              className="relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-2xl bg-brand-900 p-5 md:p-6 xl:min-h-[26rem]"
            >
              <Image
                src={area.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 264px, (min-width: 640px) 50vw, 100vw"
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover"
                style={{ objectPosition: area.position }}
              />
              {/* Degradê escuro embaixo: garante a leitura do texto sobre qualquer foto. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-brand-950 via-brand-950/60 to-transparent"
              />
              <div className="relative">
                <p className="text-sm font-semibold text-brand-200">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm text-white/85">{area.text}</p>
              </div>
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
              {projects.length > 0 && (
        <Section id="todos-os-projetos" title="Todos os projetos">
          <ProjectsGallery projects={projects} />
        </Section>
      )}
      </Section>
    </main>
  );
}