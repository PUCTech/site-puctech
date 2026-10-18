import { listFiles, readFile } from "@/lib/github";
import { parseProject, type Entry } from "@/lib/projects";
import type { Member } from "@/data/team";

// O admin lê direto do GitHub, não do build: assim ele já mostra o que acabou
// de ser salvo, mesmo antes de a Vercel terminar de publicar.

export async function loadProjects() {
  const files = (await listFiles("content/projetos")).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const entries = await Promise.all(
    files.map(async (file) => {
      const { text, sha } = await readFile(`content/projetos/${file}`);
      const errors: string[] = [];
      const entry = parseProject(file, text, errors);
      return entry ? { ...entry, sha } : null;
    }),
  );
  return entries
    .filter((entry): entry is Entry & { sha: string } => entry !== null)
    .sort((a, b) => a.order - b.order || a.project.title.localeCompare(b.project.title, "pt-BR"));
}

export async function loadMembers() {
  const { text, sha } = await readFile("content/membros.json");
  return { members: JSON.parse(text) as Member[], sha };
}
