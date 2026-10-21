import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

// Um endereço por página: o idioma é escolhido no cabeçalho, não muda a URL.
const pages = [
  "",
  "/sobre",
  "/membros",
  "/projetos",
  "/processo-seletivo",
  "/linktree",
];

// Gerado a cada pedido: os projetos vêm do banco, que não precisa estar no ar durante o build.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...pages, ...(await getProjects()).map((project) => `/projetos/${project.slug}`)].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}
