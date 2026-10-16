import type { ProjectArea } from "@/data/projects";

// Ícones de linha, discretos, para as áreas de atuação (traço no estilo Lucide).
const paths: Record<ProjectArea, React.ReactNode> = {
  "Inteligência Artificial": (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  "Engenharia de Software": <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  Cibersegurança: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  "Dados e Pesquisa Aplicada": <path d="M3 3v18h18M7 15l4-4 3 3 6-7" />,
};

export default function AreaIcon({ title, className }: { title: ProjectArea; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[title]}
    </svg>
  );
}
