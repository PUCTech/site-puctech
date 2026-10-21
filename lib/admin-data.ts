import { createHash } from "node:crypto";
import { rows, type MemberRow, type ProjectRow } from "@/lib/content";

// O admin lê direto do banco, sem a reserva de content/ que o site usa: se o banco
// falhar, melhor mostrar o erro do que editar dados velhos.

/**
 * Impressão digital da linha como foi lida. O formulário manda de volta e a ação
 * confere antes de gravar: se alguém salvou no meio do caminho, não sobrescreve.
 */
export const versionOf = (row: object) => createHash("sha1").update(JSON.stringify(row)).digest("hex");

export const loadProjects = () => rows<ProjectRow>("projects?select=*&order=order,title->>pt");
export const loadMembers = () => rows<MemberRow>("members?select=*&order=position,name");

export async function loadProject(slug: string) {
  return (await rows<ProjectRow>(`projects?select=*&slug=eq.${encodeURIComponent(slug)}`))[0];
}

export async function loadMember(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return undefined;
  return (await rows<MemberRow>(`members?select=*&id=eq.${id}`))[0];
}
