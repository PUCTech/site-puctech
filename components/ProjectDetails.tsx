import { projectStatuses, type Project } from "@/data/projects";

type ProjectDetailsProps = {
  project: Project;
  titleId: string;
  /** Na página do projeto o título é h1; no pop-up, h2. */
  titleAs?: "h1" | "h2";
  /** No pop-up, o título deixa espaço para o botão de fechar. */
  reserveCloseSpace?: boolean;
};

export default function ProjectDetails({
  project,
  titleId,
  titleAs: Title = "h2",
  reserveCloseSpace = false,
}: ProjectDetailsProps) {
  const SubTitle = Title === "h1" ? "h2" : "h3";
  const subTitleClass =
    "font-display font-bold";

  const statusLabel = projectStatuses.find(
    (item) => item.id === project.status,
  )?.label;
  const meta = [project.period, project.area, statusLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className={reserveCloseSpace ? "pr-12" : ""}>
        {meta && (
          <p className="text-sm font-medium text-accent-ink">
            {meta}
          </p>
        )}
        <Title
          id={titleId}
          className="mt-1 font-display text-3xl font-bold tracking-[-0.02em] md:text-4xl"
        >
          {project.title}
        </Title>
      </div>

      <p className="whitespace-pre-line text-lg leading-relaxed">
        {project.description}
      </p>

      {project.tech && project.tech.length > 0 && (
        <div>
          <SubTitle className={subTitleClass}>Stacks</SubTitle>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <li
                key={item}
                className="rounded-full bg-surface px-3 py-1 text-sm font-medium"
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
          <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">
            {project.objective}
          </p>
        </div>
      )}

      {project.results && (
        <div>
          <SubTitle className={subTitleClass}>
            Resultados e aprendizados
          </SubTitle>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">
            {project.results}
          </p>
        </div>
      )}

      {project.team && project.team.length > 0 && (
        <div>
          <SubTitle className={subTitleClass}>Equipe</SubTitle>
          <p className="mt-2 text-muted">{project.team.join(", ")}</p>
        </div>
      )}

      {project.repo && (
        <div>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Ver repositório ↗
          </a>
        </div>
      )}
    </div>
  );
}