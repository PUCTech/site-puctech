// Links da página /linktree (o "Nossos links" do rodapé e o link da bio nas redes).
//
// COMO EDITAR: adicione, edite ou apague objetos na lista `links`.
// A ordem da lista é a ordem na página.
//
// Campos de cada link (só `label` e `href` são obrigatórios):
//   label       → texto do botão
//   description → texto menor embaixo do nome
//   href        → endereço. Começando com "/" é uma página do site; senão, abre em outra aba.
//                 Se ficar vazio (""), o botão aparece desativado com "em breve".
//   icon        → "github" | "instagram" | "linkedin" | "tiktok" | "x" | "link" (padrão: "link")

import { selection } from "@/data/selection";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export type LinkIconId =
  | "github"
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "x"
  | "link";

export type LinkItem = {
  label: string;
  href: string;
  description?: string;
  icon?: LinkIconId;
};

// Os três primeiros links (páginas do site) mudam com o idioma; as redes são iguais em todos.
const site: Record<Lang, { site: string; selection: string; projects: string; projectsText: string }> = {
  pt: { site: "Nosso site", selection: "Processo seletivo", projects: "Nossos projetos", projectsText: "O que já construímos" },
  en: { site: "Our website", selection: "Selection process", projects: "Our projects", projectsText: "What we've built" },
  es: { site: "Nuestro sitio", selection: "Proceso de selección", projects: "Nuestros proyectos", projectsText: "Lo que ya construimos" },
};

export const links = (lang: Lang): LinkItem[] => [
  {
    label: site[lang].site,
    // O endereço do site sem o "https://", ex.: puctech.com.br
    description: siteConfig.url.replace(/^https?:\/\//, ""),
    href: "/",
  },
  {
    label: site[lang].selection,
    description: selection[lang].badge,
    href: "/processo-seletivo",
  },
  {
    label: site[lang].projects,
    description: site[lang].projectsText,
    href: "/projetos",
  },
  {
    label: "GitHub",
    description: "PUCTech",
    href: siteConfig.links.github,
    icon: "github",
  },
  {
    label: "LinkedIn",
    description: "PUC Tech",
    href: siteConfig.links.linkedin,
    icon: "linkedin",
  },
  {
    label: "Instagram",
    description: "@puctechsp",
    href: siteConfig.links.instagram,
    icon: "instagram",
  },
  {
    label: "TikTok",
    description: "@puctechsp",
    href: siteConfig.links.tiktok,
    icon: "tiktok",
  },
  {
    label: "X",
    description: "@puctechsp",
    href: siteConfig.links.x,
    icon: "x",
  },
  // Exemplos para quando existirem:
  // { label: "Comunidade no WhatsApp", href: "https://chat.whatsapp.com/...", icon: "link" },
  // { label: "Fale com a gente", description: "contato@...", href: "mailto:contato@..." },
];