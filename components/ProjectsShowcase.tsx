"use client";

import { useState } from "react";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProjectModal from "@/components/ProjectModal";
import ProjectTile from "@/components/ProjectTile";
import type { Project } from "@/data/projects";

export default function ProjectsShowcase({
  projects,
}: {
  projects: Project[];
}) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  if (projects.length === 0) return null;

  const select = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  return (
    <>
      <div className="motion-reduce:hidden">
        <FeaturedCarousel
          items={projects}
          getName={(project) => project.title}
          onSelect={select}
          paused={open}
          prevLabel="Projeto anterior"
          nextLabel="Próximo projeto"
          sizeClass="[--tile:11rem] [--ratio:0.75] sm:[--tile:14rem]"
          scales={[1.35, 1, 0.88, 0.76, 0.64]}
          renderTile={(project) => <ProjectTile project={project} />}
          renderCaption={(project) => (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">{project.title}</p>
              {project.summary && (
                <p className="mx-auto mt-1 max-w-xl text-sm text-brand-200/90">
                  {project.summary}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Para quem reduz movimento no sistema: sem animação, os projetos ficam em grade. */}
      <ul className="hidden gap-4 sm:grid-cols-2 lg:grid-cols-3 motion-reduce:grid">
        {projects.map((project) => (
          <li key={project.title}>
            <button
              type="button"
              onClick={() => select(project)}
              className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl"
            >
              <ProjectTile project={project} />
            </button>
          </li>
        ))}
      </ul>

      <ProjectModal
        project={selected}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}