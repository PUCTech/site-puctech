// Links da página /links (o "Nossos links" do rodapé e das redes).
//
// COMO EDITAR: adicione, edite ou apague objetos na lista `links`.
// A ordem da lista é a ordem na página.
//
// Campos de cada link (só `label` e `href` são obrigatórios):
//   label       → texto do botão
//   description → texto menor embaixo do nome
//   href        → endereço. Começando com "/" é uma página do site; senão, abre em outra aba.
//                 Se ficar vazio (""), o botão aparece desativado com "em breve".
//   icon        → "instagram" | "linkedin" | "tiktok" | "x" | "link" (padrão: "link")

import { siteConfig } from "@/lib/site";

export type LinkIconId = "instagram" | "linkedin" | "tiktok" | "x" | "link";

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
    label: "Instagram",
    description: "@puctechsp",
    href: siteConfig.links.instagram,
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    description: "PUC Tech",
    href: siteConfig.links.linkedin,
    icon: "linkedin",
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