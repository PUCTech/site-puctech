// Gera supabase/seed.sql a partir de content/ (membros.json e projetos/*.md com as traduções).
// Rodar: npm run db:seed  (depois `supabase db reset` carrega o seed no banco local).

import fs from "node:fs";
import path from "node:path";
import { getProjects, parseProject } from "@/lib/projects";
import type { Member } from "@/data/team";
import type { Project } from "@/data/projects";

const q = (value: string) => `'${value.replace(/'/g, "''")}'`;
const val = (value: unknown, cast = ""): string => {
  if (value === undefined || value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.length ? `array[${value.map((v) => q(String(v))).join(", ")}]${cast}` : "null";
  if (typeof value === "object") return `${q(JSON.stringify(value))}::jsonb`;
  return q(String(value));
};
const insert = (table: string, rows: Record<string, string>[]) =>
  `insert into ${table} (${Object.keys(rows[0]).map((c) => `"${c}"`).join(", ")}) values\n` +
  rows.map((row) => `  (${Object.values(row).join(", ")})`).join(",\n") +
  ";\n";

const members = JSON.parse(fs.readFileSync("content/membros.json", "utf8")) as Member[];
const memberRows = members.map((m, index) => ({
  position: val(index + 1),
  name: val(m.name),
  group: val(m.group),
  cargo: val(m.cargo),
  areas: val(m.areas, "::member_area[]"),
  president_of: val(m.presidentOf, "::member_area[]"),
  vice_of: val(m.viceOf, "::member_area[]"),
  photo: val(m.photo),
  linkedin: val(m.linkedin),
  inactive: val(m.inactive ?? false),
}));

// getProjects valida tudo (o mesmo que o build) e já aplica as traduções.
const byLang = { pt: getProjects("pt"), en: getProjects("en"), es: getProjects("es") };
const dir = path.join("content", "projetos");
const order = (slug: string) => parseProject(`${slug}.md`, fs.readFileSync(path.join(dir, `${slug}.md`), "utf8"), [])!.order;

// Texto em cada idioma; tradução igual ao português (ou ausente) fica de fora e cai no "pt".
const texts = (slug: string, key: "title" | "summary" | "description" | "objective" | "results") => {
  const of = (list: Project[]) => list.find((p) => p.slug === slug)?.[key];
  const pt = of(byLang.pt);
  if (!pt) return undefined;
  const result: Record<string, string> = { pt };
  for (const lang of ["en", "es"] as const) {
    const text = of(byLang[lang]);
    if (text && text !== pt) result[lang] = text;
  }
  return result;
};

const projectRows = byLang.pt.map((p) => ({
  slug: val(p.slug),
  order: val(order(p.slug)),
  title: val(texts(p.slug, "title")),
  summary: val(texts(p.slug, "summary")),
  description: val(texts(p.slug, "description")),
  objective: val(texts(p.slug, "objective")),
  results: val(texts(p.slug, "results")),
  area: val(p.area),
  status: val(p.status),
  period: val(p.period),
  image: val(p.image),
  tech: val(p.tech),
  team: val(p.team),
  repo: val(p.repo),
}));

process.stdout.write(
  `-- Gerado por scripts/seed.ts a partir de content/. Não edite à mão: rode \`npm run db:seed\`.\n\n` +
    insert("members", memberRows) +
    "\n" +
    insert("projects", projectRows),
);
