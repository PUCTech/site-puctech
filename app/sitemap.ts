import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

const pages = [
  "",
  "/sobre",
  "/equipe",
  "/projetos",
  "/processo-seletivo",
  "/links",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = getProjects().map(
    (project) => `/projetos/${project.slug}`,
  );

  return [...pages, ...projectPages].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}