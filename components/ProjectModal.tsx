"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";

type ProjectModalProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
};

export default function ProjectModal({
  project,
  open,
  onClose,
}: ProjectModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // O <dialog> nativo já cuida do ESC, do foco preso dentro do pop-up e do fundo.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Trava a rolagem da página enquanto o pop-up está aberto.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  const meta = project
    ? [project.period, project.area].filter(Boolean).join(" · ")
    : "";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clicar fora do pop-up (no fundo escuro) também fecha.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="project-modal-title"
      className="project-dialog m-auto max-h-[90vh] w-[min(92vw,46rem)] overflow-y-auto rounded-2xl bg-paper p-0 text-brand-950 backdrop:bg-brand-950/80 backdrop:backdrop-blur-sm"
    >
      {project && (
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-brand-950/80 text-white transition-colors hover:bg-brand-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {project.image && (
            <div className="relative aspect-video w-full bg-brand-800">
              <Image
                src={project.image}
                alt={`Imagem do projeto ${project.title}`}
                fill
                sizes="(min-width: 768px) 736px, 92vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-6 p-6 md:p-8">
            <div className={project.image ? "" : "pr-12"}>
              {meta && (
                <p className="text-sm font-medium uppercase tracking-widest text-brand-500">
                  {meta}
                </p>
              )}
              <h2
                id="project-modal-title"
                className="mt-1 text-2xl font-bold md:text-3xl"
              >
                {project.title}
              </h2>
            </div>

            <p className="whitespace-pre-line text-lg leading-relaxed text-brand-800">
              {project.description}
            </p>

            {project.tech && project.tech.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-500">
                  Stacks
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-brand-200 px-3 py-1 text-sm font-medium text-brand-800"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.objective && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-500">
                  Objetivo e escopo
                </h3>
                <p className="mt-2 whitespace-pre-line text-brand-800">
                  {project.objective}
                </p>
              </div>
            )}

            {project.results && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-500">
                  Resultados e aprendizados
                </h3>
                <p className="mt-2 whitespace-pre-line text-brand-800">
                  {project.results}
                </p>
              </div>
            )}

            {project.team && project.team.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-500">
                  Equipe
                </h3>
                <p className="mt-2 text-brand-800">{project.team.join(", ")}</p>
              </div>
            )}

            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-950 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-800"
              >
                Ver repositório ↗
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}