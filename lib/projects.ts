import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  projectAreas,
  projectStatuses,
  type Project,
  type ProjectArea,
  type ProjectStatus,
} from "@/data/projects";
import type { Lang } from "@/lib/i18n";

// Lê os projetos de content/projetos/*.md. Só roda no servidor (no build).
// Se algo estiver errado, o build falha com uma mensagem dizendo o arquivo e o problema.

const PROJECTS_DIR = path.join(process.cwd(), "content", "projetos");

// Título de cada seção do corpo do .md → campo do projeto. As traduções (en/, es/)
// usam os títulos no idioma delas.
const SECTIONS: Record<string, "description" | "objective" | "results"> = {
  "descrição": "description",
  "objetivo e escopo": "objective",
  "resultados e aprendizados": "results",
  description: "description",
  "goal and scope": "objective",
  "results and lessons learned": "results",
  "descripción": "description",
  "objetivo y alcance": "objective",
  "resultados y aprendizajes": "results",
};

type SectionField = (typeof SECTIONS)[string];
export type Entry = { project: Project; order: number };

// Linhas seguidas viram um parágrafo só; a linha em branco separa os parágrafos.
function normalize(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" "),
    )
    .filter(Boolean)
    .join("\n\n");
}

function splitSections(body: string, where: string, errors: string[]) {
  const chunks: { field: SectionField | null; lines: string[] }[] = [
    { field: null, lines: [] },
  ];

  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      const field = SECTIONS[heading[1].toLowerCase()] ?? null;
      if (!field) {
        errors.push(
          `${where}: a seção "## ${heading[1]}" não existe. Use "## Descrição", "## Objetivo e escopo" ou "## Resultados e aprendizados".`,
        );
      }
      chunks.push({ field, lines: [] });
    } else {
      chunks[chunks.length - 1].lines.push(line);
    }
  }

  const sections: Partial<Record<SectionField, string>> = {};
  chunks.forEach(({ field, lines }, index) => {
    const text = normalize(lines.join("\n"));
    if (!text) return;
    if (field) {
      sections[field] = text;
    } else if (index === 0) {
      errors.push(
        `${where}: há texto antes da primeira seção. Coloque tudo embaixo de "## Descrição".`,
      );
    }
  });
  return sections;
}

function readProject(file: string, errors: string[]): Entry | null {
  return parseProject(file, fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8"), errors);
}

/** Lê o texto de um .md de projeto. O /admin usa isto com o arquivo vindo do GitHub. */
export function parseProject(file: string, raw: string, errors: string[]): Entry | null {
  const where = `content/projetos/${file}`;

  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (error) {
    errors.push(
      `${where}: erro no cabeçalho (a parte entre os ---). Dica: use aspas em textos com ":" ou que começam com "@". (${(error as Error).message.split("\n")[0]})`,
    );
    return null;
  }

  const data: Record<string, unknown> = parsed.data;

  const text = (key: string, required = false): string | undefined => {
    const value = data[key];
    if (value === undefined || value === null || value === "") {
      if (required) errors.push(`${where}: o campo "${key}" é obrigatório.`);
      return undefined;
    }
    if (typeof value !== "string") {
      errors.push(
        `${where}: "${key}" precisa ser um texto. Coloque entre aspas (ex.: ${key}: "2026.1").`,
      );
      return undefined;
    }
    return value.trim();
  };

  const list = (key: string): string[] | undefined => {
    const value = data[key];
    if (value === undefined || value === null) return undefined;
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
      errors.push(
        `${where}: "${key}" precisa ser uma lista de textos (entre aspas, se tiverem ":" ou "@").`,
      );
      return undefined;
    }
    return value.length > 0 ? value : undefined;
  };

  const title = text("title", true);
  const area = text("area");
  const status = text("status");

  if (area && !projectAreas.some((item) => item.title === area)) {
    errors.push(
      `${where}: a área "${area}" não existe. Use uma destas: ${projectAreas.map((item) => `"${item.title}"`).join(", ")}.`,
    );
  }
  if (status && !projectStatuses.some((item) => item.id === status)) {
    errors.push(
      `${where}: o status "${status}" não existe. Use "em-andamento" ou "concluido".`,
    );
  }

  const order = data.order;
  if (order !== undefined && typeof order !== "number") {
    errors.push(`${where}: "order" precisa ser um número (ex.: order: 1).`);
  }

  const sections = splitSections(parsed.content, where, errors);
  if (!sections.description) {
    errors.push(`${where}: falta a seção "## Descrição".`);
  }

  if (!title || !sections.description) return null;

  return {
    order: typeof order === "number" ? order : 1000,
    project: {
      slug: file.replace(/\.md$/, ""),
      title,
      description: sections.description,
      image: text("image"),
      summary: text("summary"),
      period: text("period"),
      area: area as ProjectArea | undefined,
      status: status as ProjectStatus | undefined,
      tech: list("tech"),
      team: list("team"),
      objective: sections.objective,
      results: sections.results,
      repo: text("repo"),
    },
  };
}

// Tradução de um projeto: content/projetos/<idioma>/<slug>.md, só com os textos
// (title e summary no cabeçalho; as seções no corpo). O que faltar fica em português.
function translate(project: Project, lang: Lang, errors: string[]): Project {
  if (lang === "pt") return project;
  const file = path.join(PROJECTS_DIR, lang, `${project.slug}.md`);
  if (!fs.existsSync(file)) return project;
  const where = `content/projetos/${lang}/${project.slug}.md`;
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${where}: erro no cabeçalho. (${(error as Error).message.split("\n")[0]})`);
    return project;
  }
  const field = (key: string) => (typeof parsed.data[key] === "string" ? parsed.data[key].trim() : undefined);
  const sections = splitSections(parsed.content, where, errors);
  return {
    ...project,
    title: field("title") ?? project.title,
    summary: field("summary") ?? project.summary,
    description: sections.description ?? project.description,
    objective: sections.objective ?? project.objective,
    results: sections.results ?? project.results,
  };
}

// Todos os projetos, na ordem de `order` (e, em empate, pelo título em português).
// Em outro idioma, os textos vêm da tradução, quando houver.
export function getProjects(lang: Lang = "pt"): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const errors: string[] = [];
  const entries = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => readProject(file, errors))
    .filter((entry): entry is Entry => entry !== null);

  const titles = new Set<string>();
  for (const { project } of entries) {
    if (titles.has(project.title)) {
      errors.push(`Há dois projetos com o título "${project.title}". Cada título deve ser único.`);
    }
    titles.add(project.title);
  }

  if (errors.length > 0) {
    throw new Error(`Erro em content/projetos:\n- ${errors.join("\n- ")}`);
  }

  const sorted = entries
    .sort(
      (a, b) =>
        a.order - b.order ||
        a.project.title.localeCompare(b.project.title, "pt-BR"),
    )
    .map((entry) => translate(entry.project, lang, errors));

  if (errors.length > 0) {
    throw new Error(`Erro em content/projetos:\n- ${errors.join("\n- ")}`);
  }
  return sorted;
}

export function getProject(slug: string, lang: Lang = "pt"): Project | undefined {
  return getProjects(lang).find((project) => project.slug === slug);
}
/** Escreve um projeto no formato de content/projetos/*.md (o inverso de parseProject). */
export function serializeProject(project: Omit<Project, "slug">, order?: number): string {
  const data: Record<string, unknown> = { title: project.title };
  const fields = ["summary", "area", "status", "period", "image", "tech", "team", "repo"] as const;
  for (const key of fields) {
    const value = project[key];
    if (value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)) data[key] = value;
  }
  if (order !== undefined) data.order = order;

  const body = [
    ["Descrição", project.description],
    ["Objetivo e escopo", project.objective],
    ["Resultados e aprendizados", project.results],
  ]
    .filter(([, text]) => text)
    .map(([title, text]) => `## ${title}\n\n${text}\n`)
    .join("\n");
  return matter.stringify(`\n${body}`, data);
}
