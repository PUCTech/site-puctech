"use server";

import { redirect } from "next/navigation";
import { admins, endSession, githubUser, ownerId, requireAdmin } from "@/lib/admin-auth";
import { loadMember, loadProject, versionOf } from "@/lib/admin-data";
import type { MemberRow, ProjectRow, Texts } from "@/lib/content";
import { db, removeImage, uploadImage } from "@/lib/supabase";
import { projectAreas, projectStatuses } from "@/data/projects";
import { areaInfo, groups, type AreaId, type Group } from "@/data/team";

// Toda função exportada daqui vira um endpoint público: as que mexem em dados
// começam com requireAdmin(), mesmo que a página já seja protegida.

export type FormState = { error?: string };

const MAX_UPLOAD = 4 * 1024 * 1024; // a Vercel recusa requisições acima de ~4,5 MB
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// "Leonardo Grupioni" -> "leonardo-grupioni"
const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const lines = (text: string, separator: RegExp) =>
  text
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);

function url(text: string, field: string) {
  if (!text) return undefined;
  if (!/^https?:\/\/\S+$/i.test(text)) throw new Error(`${field}: use um link começando com https://`);
  return text;
}

/** Foto enviada no formulário, já validada. `null` se nenhum arquivo foi escolhido. */
async function upload(form: FormData, key: string) {
  const file = form.get(key);
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("A imagem precisa ser JPG, PNG ou WebP.");
  if (file.size > MAX_UPLOAD) throw new Error("A imagem passa de 4 MB. Diminua e tente de novo.");
  return { ext, type: file.type, content: Buffer.from(await file.arrayBuffer()) };
}

/**
 * Grava a linha (com a foto nova, se houver) e só então apaga a foto antiga. Se o
 * banco recusar, a foto recém-enviada é apagada para não sobrar solta.
 */
async function write(
  request: () => Promise<Response>,
  photo: { uploaded: string | null; previous: string | null | undefined; kept: string | null },
  duplicate: string,
) {
  const response = await request();
  if (!response.ok) {
    await removeImage(photo.uploaded);
    const error = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    throw new Error(error.code === "23505" ? duplicate : `O banco recusou: ${error.message ?? response.status}`);
  }
  if (photo.previous !== photo.kept) await removeImage(photo.previous);
}

const conflict = (what: string) => new Error(`${what} mudou desde que você abriu a página. Recarregue e tente de novo.`);

// Erros de validação viram mensagem no formulário; o resto (GitHub fora, token errado) também.
async function attempt(run: () => Promise<string>): Promise<FormState> {
  let target: string;
  try {
    target = await run();
  } catch (error) {
    const message = (error as Error).message;
    return { error: message };
  }
  redirect(target); // fora do try: o redirect do Next funciona lançando um erro especial
}

// ---------- Login ----------
// Entrar é pelo GitHub (app/api/auth/github); aqui só sair.

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------- Projetos ----------

export async function saveProject(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return attempt(async () => {
    const original = str(form, "original"); // vazio = projeto novo
    const title = str(form, "title");
    if (!title) throw new Error("O projeto precisa de um título.");
    const slug = original || slugify(str(form, "slug") || title);
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Endereço inválido: use só letras, números e hífens.");
    if (slug === "novo") throw new Error('O endereço "novo" é reservado. Escolha outro.');

    const current = original ? await loadProject(original) : undefined;
    if (original && !current) throw new Error("Projeto não encontrado.");
    if (current && versionOf(current) !== str(form, "version")) throw conflict("Este projeto");

    const area = str(form, "area");
    const status = str(form, "status");
    if (area && !projectAreas.some((item) => item.title === area)) throw new Error("Área inválida.");
    if (status && !projectStatuses.some((item) => item.id === status)) throw new Error("Status inválido.");
    const orderText = str(form, "order");
    const order = orderText ? Number(orderText) : 1000;
    if (!Number.isInteger(order)) throw new Error("Ordem precisa ser um número inteiro.");
    const description = str(form, "description").replace(/\r\n/g, "\n");
    if (!description) throw new Error('Preencha "sobre o projeto".');

    // Só o português é editado aqui; as traduções (en, es) que já existirem ficam.
    const texts = (key: "title" | "summary" | "description" | "objective" | "results", value: string): Texts | null =>
      value ? { ...(current?.[key] ?? {}), pt: value } : null;
    const list = (items: string[]) => (items.length > 0 ? items : null);

    const file = await upload(form, "image");
    const uploaded = file ? await uploadImage(`projetos/${slug}-${Date.now()}.${file.ext}`, file.content, file.type) : null;
    const image = uploaded ?? (form.get("removeImage") === "on" ? null : (current?.image ?? null));

    const row: Omit<ProjectRow, "id"> = {
      slug,
      order,
      title: texts("title", title)!,
      summary: texts("summary", str(form, "summary")),
      description: texts("description", description)!,
      objective: texts("objective", str(form, "objective").replace(/\r\n/g, "\n")),
      results: texts("results", str(form, "results").replace(/\r\n/g, "\n")),
      area: (area || null) as ProjectRow["area"],
      status: (status || null) as ProjectRow["status"],
      period: str(form, "period") || null,
      image,
      tech: list(lines(str(form, "tech"), /,/)),
      team: list(lines(str(form, "team"), /\n/)),
      repo: url(str(form, "repo"), "Repositório") ?? null,
    };

    await write(
      () =>
        current
          ? db(`projects?id=eq.${current.id}`, { method: "PATCH", body: JSON.stringify(row) })
          : db("projects", { method: "POST", body: JSON.stringify(row) }),
      { uploaded, previous: current?.image, kept: image },
      `Já existe um projeto com esse título ou em /projetos/${slug}.`,
    );
    return "/admin/projetos?ok=salvo";
  });
}

export async function deleteProject(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return attempt(async () => {
    const current = await loadProject(str(form, "original"));
    if (!current) throw new Error("Projeto não encontrado.");
    if (versionOf(current) !== str(form, "version")) throw conflict("Este projeto");
    await write(() => db(`projects?id=eq.${current.id}`, { method: "DELETE" }), { uploaded: null, previous: current.image, kept: null }, "");
    return "/admin/projetos?ok=apagado";
  });
}

// ---------- Membros ----------

export async function saveMember(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return attempt(async () => {
    const id = str(form, "id"); // vazio = pessoa nova
    const current = id ? await loadMember(id) : undefined;
    if (id && !current) throw new Error("Pessoa não encontrada.");
    if (current && versionOf(current) !== str(form, "version")) throw conflict("Esta pessoa");

    const name = str(form, "name");
    if (!name) throw new Error("Preencha o nome.");
    const group = str(form, "group") as Group;
    if (!groups.some((item) => item.id === group)) throw new Error("Grupo inválido.");
    const areaList = (key: string) => {
      const values = form.getAll(key).map(String);
      if (values.some((value) => !areaInfo.some((area) => area.id === value))) throw new Error("Área inválida.");
      return values.length > 0 ? (values as AreaId[]) : null;
    };

    // Sem ordem preenchida: a pessoa nova vai para o fim (do grupo dela, que é como o site agrupa).
    const positionText = str(form, "position");
    let position = positionText ? Number(positionText) : current?.position;
    if (position === undefined) {
      const [last] = (await (await db("members?select=position&order=position.desc&limit=1")).json()) as { position: number }[];
      position = (last?.position ?? 0) + 1;
    }
    if (!Number.isInteger(position)) throw new Error("Ordem precisa ser um número inteiro.");

    const file = await upload(form, "photo");
    const uploaded = file ? await uploadImage(`membros/${slugify(name)}-${Date.now()}.${file.ext}`, file.content, file.type) : null;
    const photo = uploaded ?? (form.get("removePhoto") === "on" ? null : (current?.photo ?? null));

    // Campos que não valem para o grupo escolhido são descartados em vez de dar erro.
    const canHaveAreas = group === "membro" || group === "trainee";
    const row: Omit<MemberRow, "id"> = {
      position,
      name,
      group,
      cargo: str(form, "cargo") || null,
      areas: canHaveAreas ? areaList("areas") : null,
      president_of: group === "membro" ? areaList("presidentOf") : null,
      vice_of: group === "membro" ? areaList("viceOf") : null,
      photo,
      linkedin: url(str(form, "linkedin"), "LinkedIn") ?? null,
      inactive: form.get("inactive") === "on",
    };

    await write(
      () =>
        current
          ? db(`members?id=eq.${current.id}`, { method: "PATCH", body: JSON.stringify(row) })
          : db("members", { method: "POST", body: JSON.stringify(row) }),
      { uploaded, previous: current?.photo, kept: photo },
      "",
    );
    return "/admin/membros?ok=salvo";
  });
}

export async function deleteMember(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return attempt(async () => {
    const current = await loadMember(str(form, "id"));
    if (!current) throw new Error("Pessoa não encontrada.");
    if (versionOf(current) !== str(form, "version")) throw conflict("Esta pessoa");
    await write(() => db(`members?id=eq.${current.id}`, { method: "DELETE" }), { uploaded: null, previous: current.photo, kept: null }, "");
    return "/admin/membros?ok=apagado";
  });
}

// ---------- Admins ----------
// Quem pode entrar no /admin. Vale a conta do GitHub (id), buscada aqui pelo nome de usuário.

export async function addAdmin(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();
  return attempt(async () => {
    const login = str(form, "login").replace(/^@/, "").toLowerCase();
    // Regra de nomes do GitHub: letras, números e hífens soltos, até 39 caracteres.
    if (!/^[a-z0-9](?:-?[a-z0-9]){0,38}$/.test(login)) throw new Error("Usuário do GitHub inválido.");
    const user = await githubUser(login);
    if (!user) throw new Error(`Não existe usuário @${login} no GitHub.`);
    if ((await admins(`github_id=eq.${user.id}`)).length > 0) throw new Error(`@${user.login} já é admin.`);
    const body = JSON.stringify({ github_login: user.login.toLowerCase(), github_id: user.id, added_by: me.github_login });
    await admins("", { method: "POST", body });
    return "/admin/admins";
  });
}

export async function removeAdmin(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();
  return attempt(async () => {
    const [admin] = await admins(`id=eq.${encodeURIComponent(str(form, "id"))}`);
    if (!admin) throw new Error("Admin não encontrado.");
    if (admin.id === me.id) throw new Error("Você não pode remover a si mesmo.");
    if (admin.github_id === ownerId()) throw new Error("O dono (ADMIN_GITHUB_ID) não pode ser removido por aqui.");
    await admins(`id=eq.${admin.id}`, { method: "DELETE" });
    return "/admin/admins";
  });
}
