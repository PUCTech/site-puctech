"use client";

import Image from "next/image";
import { useState } from "react";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProjectModal from "@/components/ProjectModal";
import type { Project } from "@/data/projects";

function ProjectTile({ project }: { project: Project }) {
  return (
    <div className="relative size-full bg-linear-to-br from-brand-800 to-brand-900 text-left">
      {project.image && (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 640px) 320px, 240px"
          loading="eager"
          className="object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-950/90 via-brand-950/50 to-transparent px-3 pb-3 pt-10">
        <p className="line-clamp-2 text-sm font-semibold text-white">
          {project.title}
        </p>
      </div>
    </div>
  );
}

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