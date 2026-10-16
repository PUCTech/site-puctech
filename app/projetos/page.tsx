import type { Metadata } from "next";
import Image from "next/image";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import { Block } from "@/components/Section";
import { projectAreas, projectsPage } from "@/data/projects";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Conheça os projetos da PUC Tech: inteligência artificial, engenharia de software, cibersegurança e dados, sempre com foco em impacto real.",
};

export default function ProjetosPage() {
  return (
    <ProjectsShowcase
      title={projectsPage.title}
      intro={projectsPage.intro}
      projects={getProjects()}
    >
      <Block id="areas" title="Áreas de Atuação">
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {projectAreas.map((area) => (
            <li key={area.title} className="flex gap-5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={area.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                  style={{ objectPosition: area.position }}
                />
              </div>
              <div>
                <h3 className="font-display font-bold">{area.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{area.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>
    </ProjectsShowcase>
  );
}
