import type { Metadata } from "next";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Reveal from "@/components/Reveal";
import { Stage } from "@/components/Section";
import { projectsPage } from "@/data/projects";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Conheça os projetos da PUC Tech: inteligência artificial, engenharia de software, cibersegurança e dados, sempre com foco em impacto real.",
};

export default function ProjetosPage() {
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <h1 className="fade-in text-4xl font-bold tracking-[-0.04em] md:text-6xl">{projectsPage.title}</h1>
        <p className="fade-in mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-muted [animation-delay:250ms] md:text-xl">
          {projectsPage.intro}
        </p>
      </Stage>

      <Stage id="lista" className="pt-4 pb-20 md:pb-28">
        <Reveal delay={150}>
          <ProjectsShowcase projects={getProjects()} />
        </Reveal>
      </Stage>
    </main>
  );
}
