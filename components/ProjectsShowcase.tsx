"use client";

import { useId, useState } from "react";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProjectModal from "@/components/ProjectModal";
import ProjectTile from "@/components/ProjectTile";
import {
  projectAreas,
  projectStatuses,
  type Project,
  type ProjectArea,
  type ProjectStatus,
} from "@/data/projects";

const field =
  "w-full appearance-none rounded-lg border border-brand-800 bg-brand-950 py-2.5 pl-3.5 pr-10 text-[15px] text-white scheme-dark transition-colors hover:border-brand-500 focus-visible:border-brand-200 focus-visible:outline-none";

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function ProjectsShowcase({
  projects,
}: {
  projects: Project[];
}) {
  const panelId = useId();
  const areaId = useId();
  const statusId = useId();
  const gridId = useId();

  const [filtersOpen, setFiltersOpen] = useState(false);
  // "" = sem filtro (todas as áreas / todos os status).
  const [area, setArea] = useState<ProjectArea | "">("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  if (projects.length === 0) return null;

  const activeCount = (area ? 1 : 0) + (status ? 1 : 0);
  const visible = projects.filter(
    (project) =>
      (!area || project.area === area) &&
      (!status || project.status === status),
  );

  const select = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`inline-flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200 ${
            filtersOpen
              ? "border-brand-200 bg-brand-900"
              : "border-brand-800 hover:border-brand-500"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
            <circle cx="16" cy="7" r="2" />
            <circle cx="8" cy="17" r="2" />
          </svg>
          Filtros
          {activeCount > 0 && (
            <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-brand-200 text-[11px] font-bold text-brand-950">
              <span className="sr-only">{activeCount} ativos: </span>
              <span aria-hidden>{activeCount}</span>
            </span>
          )}
        </button>

        <p className="text-[15px] text-brand-200/80" aria-live="polite">
          {visible.length} {visible.length === 1 ? "projeto" : "projetos"}
        </p>
      </div>

      {filtersOpen && (
        <div
          id={panelId}
          className="mt-3.5 rounded-xl border border-brand-800 bg-brand-900/60 p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={areaId}
                className="mb-1.5 block text-sm font-semibold"
              >
                Área
              </label>
              <div className="relative">
                <select
                  id={areaId}
                  value={area}
                  onChange={(event) =>
                    setArea(event.target.value as ProjectArea | "")
                  }
                  className={field}
                >
                  <option value="">Todas as áreas</option>
                  {projectAreas.map((item) => (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <Chevron className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-200/70" />
              </div>
            </div>

            <div>
              <label
                htmlFor={statusId}
                className="mb-1.5 block text-sm font-semibold"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id={statusId}
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as ProjectStatus | "")
                  }
                  className={field}
                >
                  <option value="">Todos os status</option>
                  {projectStatuses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <Chevron className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-200/70" />
              </div>
            </div>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setArea("");
                setStatus("");
              }}
              className="mt-4 text-[13px] text-brand-200/80 underline underline-offset-4 transition-colors hover:text-white"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-10 max-w-2xl text-lg text-brand-200/90">
          Nenhum projeto encontrado com esses filtros.
        </p>
      ) : (
        <>
          <div className="mt-10 motion-reduce:hidden">
            <FeaturedCarousel
              // Recomeça do primeiro projeto quando a lista filtrada muda.
              key={visible.map((project) => project.title).join("|")}
              items={visible}
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

          {/* Quem reduz movimento não vê o carrossel, então a lista fica sempre aberta e o botão some. */}
          <div className="mt-10 flex justify-center motion-reduce:hidden">
            <button
              type="button"
              aria-expanded={showAll}
              aria-controls={gridId}
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2.5 rounded-full border border-brand-500 px-6 py-3 font-medium transition-colors hover:border-brand-200 hover:text-brand-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200"
            >
              {showAll ? "Ocultar lista" : "Ver todos os projetos"}
              <Chevron
                className={`transition-transform ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <ul
            id={gridId}
            className={`mt-8 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
              showAll ? "grid" : "hidden motion-reduce:grid"
            }`}
          >
            {visible.map((project) => (
              <li key={project.title}>
                <button
                  type="button"
                  onClick={() => select(project)}
                  className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border border-transparent transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200"
                >
                  <ProjectTile project={project} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <ProjectModal
        project={selected}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}