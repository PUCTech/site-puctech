"use client";

import { useState, type ReactNode } from "react";
import ProjectModal from "@/components/ProjectModal";
import ProjectTile from "@/components/ProjectTile";
import { SidebarLayout } from "@/components/Section";
import {
  projectAreas,
  projectStatuses,
  type Project,
  type ProjectArea,
  type ProjectStatus,
} from "@/data/projects";

const option = (active: boolean) =>
  `rounded-full px-3.5 py-1.5 text-left text-sm font-medium transition-colors ${
    active ? "bg-ink text-paper" : "bg-surface text-muted hover:text-ink"
  }`;

// Filtro de escolha única, com "" = sem filtro.
function Filter<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T | ""; label: string }[];
  value: T | "";
  onChange: (value: T | "") => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={value === item.value}
            onClick={() => onChange(item.value)}
            className={option(value === item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ProjectsShowcase({
  title,
  intro,
  projects,
  children,
}: {
  title: string;
  intro: string;
  projects: Project[];
  children?: ReactNode;
}) {
  const [area, setArea] = useState<ProjectArea | "">("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const visible = projects.filter(
    (project) =>
      (!area || project.area === area) &&
      (!status || project.status === status),
  );

  return (
    <SidebarLayout
      title={title}
      intro={<p>{intro}</p>}
      aside={
        projects.length > 0 && (
          <div className="space-y-6">
            <Filter
              label="Área"
              value={area}
              onChange={setArea}
              options={[
                { value: "", label: "Todas as áreas" },
                ...projectAreas.map((item) => ({ value: item.title, label: item.title })),
              ]}
            />
            <Filter
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "", label: "Todos os status" },
                ...projectStatuses.map((item) => ({ value: item.id, label: item.label })),
              ]}
            />
            <p className="text-sm text-muted" aria-live="polite">
              {visible.length} {visible.length === 1 ? "projeto" : "projetos"}
            </p>
          </div>
        )
      }
    >
      {projects.length === 0 ? (
        <p className="text-lg text-muted">
          Em breve, os projetos da PUC Tech vão aparecer aqui.
        </p>
      ) : visible.length === 0 ? (
        <div>
          <p className="text-lg">Nenhum projeto encontrado com esses filtros.</p>
          <button
            type="button"
            onClick={() => {
              setArea("");
              setStatus("");
            }}
            className="mt-3 font-semibold text-accent-ink underline underline-offset-4 hover:text-ink"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="grid gap-x-8 gap-y-12 pb-12 sm:grid-cols-2 md:pb-16">
          {visible.map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => {
                  setSelected(project);
                  setOpen(true);
                }}
                className="group block h-full w-full cursor-pointer rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink"
              >
                <ProjectTile project={project} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {children}

      <ProjectModal project={selected} open={open} onClose={() => setOpen(false)} />
    </SidebarLayout>
  );
}
