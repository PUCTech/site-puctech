const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "PUC Tech",
  url: siteUrl,
  description: "A Primeira Liga de Ciência e Tecnologia da PUC-SP",
  links: {
    github: "https://github.com/PUCTech",
    instagram: "https://www.instagram.com/puctechsp/",
    linkedin: "https://www.linkedin.com/company/puctechsp/",
    tiktok: "https://www.tiktok.com/@puctechsp",
    x: "https://x.com/puctechsp_",
    allLinks: "/linktree",
  },
};

// Menu do site. O texto de cada item fica em data/ui.ts (nav), em cada idioma.
export const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/sobre" },
  { key: "members", href: "/membros" },
  { key: "projects", href: "/projetos" },
  { key: "selection", href: "/processo-seletivo" },
] as const;
