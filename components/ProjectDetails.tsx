import Image from "next/image";
import Link from "next/link";
import { projectStatuses, type Project } from "@/data/projects";

type ProjectDetailsProps = {
  project: Project;
  titleId: string;
  /** Na página do projeto o título é h1; no pop-up, h2. */
  titleAs?: "h1" | "h2";
  /** No pop-up, sem capa o título deixa espaço para o botão de fechar. */
  reserveCloseSpace?: boolean;
  /** Mostra o botão que abre a página do projeto (usado no pop-up). */
  showPageLink?: boolean;
};

export default function ProjectDetails({
  project,
  titleId,
  titleAs: Title = "h2",
  reserveCloseSpace = false,
  showPageLink = false,
}: ProjectDetailsProps) {
  const SubTitle = Title === "h1" ? "h2" : "h3";
  const subTitleClass =
    "text-sm font-semibold uppercase tracking-widest text-brand-500";

  const statusLabel = projectStatuses.find(
    (item) => item.id === project.status,
  )?.label;
  const meta = [project.period, project.area, statusLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
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
        <div className={reserveCloseSpace && !project.image ? "pr-12" : ""}>
          {meta && (
            <p className="text-sm font-medium uppercase tracking-widest text-brand-500">
              {meta}
            </p>
          )}
          <Title id={titleId} className="mt-1 text-2xl font-bold md:text-3xl">
            {project.title}
          </Title>
        </div>

        <p className="whitespace-pre-line text-lg leading-relaxed text-brand-800">
          {project.description}
        </p>

        {project.tech && project.tech.length > 0 && (
          <div>
            <SubTitle className={subTitleClass}>Stacks</SubTitle>
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
            <SubTitle className={subTitleClass}>Objetivo e escopo</SubTitle>
            <p className="mt-2 whitespace-pre-line text-brand-800">
              {project.objective}
            </p>
          </div>
        )}

        {project.results && (
          <div>
            <SubTitle className={subTitleClass}>
              Resultados e aprendizados
            </SubTitle>
            <p className="mt-2 whitespace-pre-line text-brand-800">
              {project.results}
            </p>
          </div>
        )}

        {project.team && project.team.length > 0 && (
          <div>
            <SubTitle className={subTitleClass}>Equipe</SubTitle>
            <p className="mt-2 text-brand-800">{project.team.join(", ")}</p>
          </div>
        )}

        {(project.repo || showPageLink) && (
          <div className="flex flex-wrap gap-3">
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
            {showPageLink && (
              <Link
                href={`/projetos/${project.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-800 px-6 py-3 font-medium text-brand-800 transition-colors hover:bg-brand-950 hover:text-white"
              >
                Abrir página do projeto →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}