import type { MetadataRoute } from "next";
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
  return pages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}