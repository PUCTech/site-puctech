// Lê e grava arquivos do repositório pela API do GitHub. É assim que o /admin
// salva: cada "Salvar" vira um commit, e a Vercel publica o site de novo.
// Variáveis: GITHUB_TOKEN (fine-grained, só este repositório, "Contents: read and write"),
// GITHUB_REPO (padrão PUCTech/site-puctech) e GITHUB_BRANCH (padrão main).

const repo = () => process.env.GITHUB_REPO || "PUCTech/site-puctech";
const branch = () => process.env.GITHUB_BRANCH || "main";

async function gh<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN não configurado.");
  const response = await fetch(`https://api.github.com/repos/${repo()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub ${response.status} em ${path}: ${(await response.text()).slice(0, 200)}`);
  }
  return response.json() as Promise<T>;
}

/** Conteúdo de um arquivo de texto e o sha dele (para saber se mudou desde que foi lido). */
export async function readFile(path: string): Promise<{ text: string; sha: string }> {
  const file = await gh<{ content: string; sha: string }>(
    `/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch())}`,
  );
  return { text: Buffer.from(file.content, "base64").toString("utf8"), sha: file.sha };
}

/** Nomes dos arquivos de uma pasta. */
export async function listFiles(path: string): Promise<string[]> {
  const items = await gh<{ name: string; type: string }[]>(
    `/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch())}`,
  );
  return items.filter((item) => item.type === "file").map((item) => item.name);
}

/**
 * Um commit só com várias mudanças: `content` grava o arquivo, `null` apaga.
 * Se alguém publicar no meio do caminho, o GitHub recusa (não sobrescreve nada).
 */
export async function commit(message: string, changes: { path: string; content: string | Buffer | null }[]) {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${branch()}`);
  const parent = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);

  const tree = await Promise.all(
    changes.map(async ({ path, content }) => {
      if (content === null) return { path, mode: "100644", type: "blob", sha: null };
      const blob = await gh<{ sha: string }>("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: Buffer.from(content).toString("base64"), encoding: "base64" }),
      });
      return { path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );

  const newTree = await gh<{ sha: string }>("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const created = await gh<{ sha: string }>("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
  });
  // Sem force: se o branch andou desde a leitura, o GitHub responde erro em vez de perder commits.
  await gh(`/git/refs/heads/${branch()}`, { method: "PATCH", body: JSON.stringify({ sha: created.sha }) });
}
