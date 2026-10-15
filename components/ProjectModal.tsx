"use client";

import { useEffect, useId, useRef } from "react";
import ProjectDetails from "@/components/ProjectDetails";
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
  // Id gerado: a página tem mais de um pop-up (carrossel e galeria), então não pode ser fixo.
  const titleId = useId();

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

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clicar fora do pop-up (no fundo escuro) também fecha.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby={titleId}
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

          <ProjectDetails
            project={project}
            titleId={titleId}
            titleAs="h2"
            reserveCloseSpace
            showPageLink
          />
        </div>
      )}
    </dialog>
  );
}