import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/sobre", "/equipe", "/projetos"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}