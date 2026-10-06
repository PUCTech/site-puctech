const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "PucTech",
  url: siteUrl,
  description: "Liga Acadêmica de Tecnologia da PUC-SP",
  links: {
    instagram: "https://www.instagram.com/puctechsp/",
    linkedin: "https://www.linkedin.com/company/puctechsp/",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Equipe", href: "/equipe" },
];