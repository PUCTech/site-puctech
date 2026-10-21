import "server-only";
import type { Project } from "@/data/projects";
import type { Member } from "@/data/team";
import membersFile from "@/content/membros.json";
import type { Lang } from "@/lib/i18n";
import { getProjects as projectsFromFiles } from "@/lib/projects";
import { db } from "@/lib/supabase";

// O site lê membros e projetos do Supabase, já no formato que os componentes usam.
// Se o banco falhar, usa content/ (membros.json e projetos/*.md): pode estar
// desatualizado, mas a página abre em vez de dar erro.

async function orFiles<R>(what: string, read: () => Promise<R>, fallback: () => R): Promise<R> {
  try {
    return await read();
  } catch (error) {
    console.error(`Supabase indisponível (${what}); usando content/.`, error);
    return fallback();
  }
}

export async function rows<R>(path: string): Promise<R[]> {
  const response = await db(path);
  if (!response.ok) throw new Error(`Supabase ${response.status} em ${path}: ${(await response.text()).slice(0, 200)}`);
  return response.json();
}

// null do banco -> campo ausente, como era no JSON e no .md.
const opt = <V>(value: V | null) => value ?? undefined;

export type MemberRow = {
  id: string;
  position: number;
  name: string;
  group: Member["group"];
  cargo: string | null;
  areas: Member["areas"] | null;
  president_of: Member["areas"] | null;
  vice_of: Member["areas"] | null;
  photo: string | null;
  linkedin: string | null;
  inactive: boolean;
};

/** Todo mundo, na ordem do site, inclusive quem já saiu (creditado nos projetos). */
export async function getAllMembers(): Promise<Member[]> {
  return orFiles("membros", membersFromDb, () => membersFile as Member[]);
}

async function membersFromDb(): Promise<Member[]> {
  return (await rows<MemberRow>("members?select=*&order=position,name")).map((m) => ({
    name: m.name,
    group: m.group,
    cargo: opt(m.cargo),
    areas: opt(m.areas),
    presidentOf: opt(m.president_of),
    viceOf: opt(m.vice_of),
    photo: opt(m.photo),
    linkedin: opt(m.linkedin),
    inactive: m.inactive || undefined,
  }));
}

export type Texts = Partial<Record<Lang, string>> & { pt: string };
export type ProjectRow = {
  id: string;
  slug: string;
  order: number;
  title: Texts;
  summary: Texts | null;
  description: Texts;
  objective: Texts | null;
  results: Texts | null;
  area: Project["area"] | null;
  status: Project["status"] | null;
  period: string | null;
  image: string | null;
  tech: string[] | null;
  team: string[] | null;
  repo: string | null;
};

/** Projetos na ordem do site (order e, no empate, título em português), no idioma pedido. */
export async function getProjects(lang: Lang = "pt", slug?: string): Promise<Project[]> {
  return orFiles("projetos", () => projectsFromDb(lang, slug), () =>
    projectsFromFiles(lang).filter((project) => !slug || project.slug === slug),
  );
}

async function projectsFromDb(lang: Lang, slug?: string): Promise<Project[]> {
  const filter = slug ? `&slug=eq.${encodeURIComponent(slug)}` : "";
  const text = (value: Texts | null) => (value ? (value[lang] ?? value.pt) : undefined);
  return (await rows<ProjectRow>(`projects?select=*&order=order,title->>pt${filter}`)).map((p) => ({
    slug: p.slug,
    title: text(p.title)!,
    summary: text(p.summary),
    description: text(p.description)!,
    objective: text(p.objective),
    results: text(p.results),
    area: opt(p.area),
    status: opt(p.status),
    period: opt(p.period),
    image: opt(p.image),
    tech: opt(p.tech),
    team: opt(p.team),
    repo: opt(p.repo),
  }));
}

export async function getProject(slug: string, lang: Lang = "pt"): Promise<Project | undefined> {
  return (await getProjects(lang, slug))[0];
}
