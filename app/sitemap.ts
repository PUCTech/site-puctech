import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/sobre", "/equipe", "/projetos", "/processo-seletivo", "/links"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}