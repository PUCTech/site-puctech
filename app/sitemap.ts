import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
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

export default function sitemap(): MetadataRoute.Sitemap {
  return [...pages, ...getProjects().map((project) => `/projetos/${project.slug}`)].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}
