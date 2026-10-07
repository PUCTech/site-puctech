const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "PUC Tech",
  url: siteUrl,
  description: "A Primeira Liga de Ciência e Tecnologia da PUC-SP",
  links: {
    instagram: "https://www.instagram.com/puctechsp/",
    linkedin: "https://www.linkedin.com/company/puctechsp/",
    tiktok: "https://www.tiktok.com/@puctechsp",
    x: "https://x.com/puctechsp",
    allLinks: "https://puctech.com.br/links",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Membros", href: "/equipe" },
  { label: "Projetos", href: "/projetos" },
  { label: "Processo Seletivo", href: "/processo-seletivo" },
];