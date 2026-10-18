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

import { selectionPage } from "@/data/selection";
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

export const linksPage = {
  title: "PUC Tech",
  tagline: "A Primeira Liga de Ciência e Tecnologia da PUC-SP",
};

export const links: LinkItem[] = [
  {
    label: "Nosso site",
    // O endereço do site sem o "https://", ex.: puctech.com.br
    description: siteConfig.url.replace(/^https?:\/\//, ""),
    href: "/",
  },
  {
    label: "Processo seletivo",
    description: selectionPage.badge,
    href: "/processo-seletivo",
  },
  {
    label: "Nossos projetos",
    description: "O que já construímos",
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