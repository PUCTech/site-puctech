"use server";

import { redirect } from "next/navigation";
import { checkKey, endSession, requireAdmin, startSession } from "@/lib/admin-auth";
import { commit, listFiles, readFile } from "@/lib/github";
import { parseProject, serializeProject } from "@/lib/projects";
import { projectAreas, projectStatuses, type Project } from "@/data/projects";
import { areaInfo, groups, teamErrors, type AreaId, type Group, type Member } from "@/data/team";

// Toda função exportada daqui vira um endpoint público: as que mexem em dados
// começam com requireAdmin(), mesmo que a página já seja protegida.

export type FormState = { error?: string };

const MEMBERS = "content/membros.json";
const PROJECTS = "content/projetos";
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
  return { ext, content: Buffer.from(await file.arrayBuffer()) };
}

// Erros de validação viram mensagem no formulário; o resto (GitHub fora, token errado) também.
async function attempt(run: () => Promise<string>): Promise<FormState> {
  let target: string;
  try {
    target = await run();
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("fast forward")) {
      return { error: "Alguém salvou ao mesmo tempo. Recarregue a página e tente de novo." };
    }
    return { error: message };
  }
  redirect(target); // fora do try: o redirect do Next funciona lançando um erro especial
}

// ---------- Login ----------

export async function login(_: FormState, form: FormData): Promise<FormState> {
  // Atraso fixo: deixa tentativas em massa lentas (a chave em si já é impossível de adivinhar).
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (!checkKey(str(form, "key"))) return { error: "Chave incorreta." };
  await startSession();
  redirect("/admin");
}

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
    const path = `${PROJECTS}/${slug}.md`;

    const existing = await listFiles(PROJECTS);
    if (!original && existing.includes(`${slug}.md`)) throw new Error(`Já existe um projeto em /projetos/${slug}.`);
    if (original) {
      const current = await readFile(path);
      if (current.sha !== str(form, "sha")) {
        throw new Error("Este projeto mudou desde que você abriu a página. Recarregue e tente de novo.");
      }
    }

    const area = str(form, "area");
    const status = str(form, "status");
    if (area && !projectAreas.some((item) => item.title === area)) throw new Error("Área inválida.");
    if (status && !projectStatuses.some((item) => item.id === status)) throw new Error("Status inválido.");
    const orderText = str(form, "order");
    const order = orderText ? Number(orderText) : undefined;
    if (order !== undefined && !Number.isFinite(order)) throw new Error("Ordem precisa ser um número.");

    const photo = await upload(form, "image");
    const imagePath = photo ? `public/projetos/${slug}.${photo.ext}` : null;
    const image = imagePath
      ? imagePath.replace(/^public/, "")
      : form.get("removeImage") === "on"
        ? undefined
        : str(form, "currentImage") || undefined;

    const project: Omit<Project, "slug"> = {
      title,
      summary: str(form, "summary") || undefined,
      area: (area || undefined) as Project["area"],
      status: (status || undefined) as Project["status"],
      period: str(form, "period") || undefined,
      image,
      tech: lines(str(form, "tech"), /,/),
      team: lines(str(form, "team"), /\n/),
      repo: url(str(form, "repo"), "Repositório"),
      description: str(form, "description").replace(/\r\n/g, "\n"),
      objective: str(form, "objective").replace(/\r\n/g, "\n") || undefined,
      results: str(form, "results").replace(/\r\n/g, "\n") || undefined,
    };

    // Confere com o mesmo leitor do site: se o build fosse quebrar, o erro aparece aqui.
    const markdown = serializeProject(project, order);
    const errors: string[] = [];
    parseProject(`${slug}.md`, markdown, errors);
    if (errors.length > 0) throw new Error(errors.join(" "));

    await commit(`${original ? "Atualiza" : "Adiciona"} projeto: ${title} (via /admin)`, [
      { path, content: markdown },
      ...(photo && imagePath ? [{ path: imagePath, content: photo.content }] : []),
    ]);
    return "/admin/projetos?ok=salvo";
  });
}

export async function deleteProject(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return attempt(async () => {
    const slug = str(form, "original");
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Projeto inválido.");
    const path = `${PROJECTS}/${slug}.md`;
    const current = await readFile(path);
    if (current.sha !== str(form, "sha")) throw new Error("Este projeto mudou. Recarregue antes de apagar.");
    await commit(`Remove projeto: ${slug} (via /admin)`, [{ path, content: null }]);
    return "/admin/projetos?ok=apagado";
  });
}

// ---------- Membros ----------

async function readMembers(sha: string) {
  const file = await readFile(MEMBERS);
  if (file.sha !== sha) throw new Error("A lista de membros mudou desde que você abriu a página. Recarregue e tente de novo.");
  return JSON.parse(file.text) as Member[];
}

// Uma pessoa por linha: diffs pequenos e fácil de editar à mão.
const membersJson = (list: Member[]) => `[\n${list.map((m) => `  ${JSON.stringify(m)}`).join(",\n")}\n]\n`;

export async function saveMember(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return attempt(async () => {
    const list = await readMembers(str(form, "sha"));
    const indexText = str(form, "index"); // vazio = pessoa nova
    const index = indexText === "" ? -1 : Number(indexText);
    if (index !== -1 && !(Number.isInteger(index) && list[index])) throw new Error("Pessoa não encontrada.");

    const name = str(form, "name");
    if (!name) throw new Error("Preencha o nome.");
    const group = str(form, "group") as Group;
    if (!groups.some((item) => item.id === group)) throw new Error("Grupo inválido.");
    const areaList = (key: string) => {
      const values = form.getAll(key).map(String);
      if (values.some((value) => !areaInfo.some((area) => area.id === value))) throw new Error("Área inválida.");
      return values.length > 0 ? (values as AreaId[]) : undefined;
    };

    const photo = await upload(form, "photo");
    const photoPath = photo ? `public/equipe/${slugify(name)}.${photo.ext}` : null;
    const previous = index === -1 ? undefined : list[index];

    // Campos que não valem para o grupo escolhido são descartados em vez de dar erro.
    const canHaveAreas = group === "membro" || group === "trainee";
    const member: Member = {
      name,
      group,
      ...(str(form, "cargo") && { cargo: str(form, "cargo") }),
      ...(canHaveAreas && { areas: areaList("areas") }),
      ...(group === "membro" && { presidentOf: areaList("presidentOf"), viceOf: areaList("viceOf") }),
      ...(photoPath
        ? { photo: photoPath.replace(/^public/, "") }
        : form.get("removePhoto") !== "on" && previous?.photo
          ? { photo: previous.photo }
          : {}),
      ...(str(form, "linkedin") && { linkedin: url(str(form, "linkedin"), "LinkedIn") }),
      ...(form.get("inactive") === "on" && { inactive: true }),
    };
    const clean = JSON.parse(JSON.stringify(member)) as Member; // tira os campos undefined

    if (index === -1) {
      // Entra logo depois da última pessoa do mesmo grupo (ou no fim da lista).
      const last = list.findLastIndex((m) => m.group === group);
      list.splice(last === -1 ? list.length : last + 1, 0, clean);
    } else {
      list[index] = clean;
    }

    const errors = teamErrors(list);
    if (errors.length > 0) throw new Error(errors.join(" "));

    await commit(`${index === -1 ? "Adiciona" : "Atualiza"} membro: ${name} (via /admin)`, [
      { path: MEMBERS, content: membersJson(list) },
      ...(photo && photoPath ? [{ path: photoPath, content: photo.content }] : []),
    ]);
    return "/admin/membros?ok=salvo";
  });
}

export async function deleteMember(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return attempt(async () => {
    const list = await readMembers(str(form, "sha"));
    const index = Number(str(form, "index"));
    const member = list[index];
    if (!Number.isInteger(index) || !member) throw new Error("Pessoa não encontrada.");
    list.splice(index, 1);
    await commit(`Remove membro: ${member.name} (via /admin)`, [{ path: MEMBERS, content: membersJson(list) }]);
    return "/admin/membros?ok=apagado";
  });
}
