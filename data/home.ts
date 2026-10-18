// Textos e números da home, em cada idioma. Para destacar uma palavra em negrito, use **assim**.
// Mudou um texto em português? Mude também em `en` e `es`, logo abaixo.

import type { Lang } from "@/lib/i18n";

const pt = {
  hero: {
    title: "A Primeira Liga de Ciência e Tecnologia da PUC-SP",
  },
  numbers: "Nossos números",
  hiredTitle: "Empresas que contrataram nossos membros",
  about: {
    title: "Sobre",
    paragraphs: [
      "A **PUC Tech** é a primeira liga de ciência e tecnologia da PUC-SP, formada por estudantes que veem no protagonismo estudantil um motor de transformação. Criamos experiências práticas que unem teoria, tecnologia e impacto social.",
      "Atuamos com projetos, oficinas, eventos e iniciativas que desenvolvem competências técnicas, profissionais e humanas. Aqui, estudantes lideram, inovam e constroem soluções reais para desafios concretos, sempre em equipe.",
    ],
  },
  // Mesma ordem dos números em `stats`, mais abaixo.
  statLabels: [
    "Estudantes já passaram pela liga",
    "Projetos desenvolvidos",
    "Eventos realizados",
    "Empresas parceiras",
    "Estudantes empregados",
  ],
  projectsIntro: {
    title: "Projetos",
    text: "Soluções aplicadas em IA, engenharia de software, cibersegurança e inovação social.",
  },
  partnersIntro: {
    title: "Parceiros da PUC Tech",
    paragraphs: [
      "Acreditamos que inovação se faz em comunidade.",
      "Contamos com o apoio de empresas, organizações estudantis, startups e da própria universidade para ampliar nosso impacto.",
    ],
  },
  socialIntro: {
    title: "Acompanhe nossas redes sociais",
    tagline: "Não perca nenhuma novidade!",
    text: "Divulgamos projetos, eventos, mentorias e oportunidades de envolvimento pelas nossas redes sociais.",
  },
};

type HomeContent = typeof pt;

const en: HomeContent = {
  hero: {
    title: "The First Science and Technology League at PUC-SP",
  },
  numbers: "Our numbers",
  hiredTitle: "Companies that hired our members",
  about: {
    title: "About",
    paragraphs: [
      "**PUC Tech** is the first science and technology league at PUC-SP, made up of students who see student leadership as a driver of change. We create hands-on experiences that bring together theory, technology and social impact.",
      "We run projects, workshops, events and initiatives that build technical, professional and human skills. Here, students lead, innovate and build real solutions to concrete challenges, always as a team.",
    ],
  },
  statLabels: [
    "Students have been part of the league",
    "Projects built",
    "Events held",
    "Partner companies",
    "Students hired",
  ],
  projectsIntro: {
    title: "Projects",
    text: "Applied solutions in AI, software engineering, cybersecurity and social innovation.",
  },
  partnersIntro: {
    title: "PUC Tech Partners",
    paragraphs: [
      "We believe innovation happens in community.",
      "We count on the support of companies, student organizations, startups and the university itself to expand our impact.",
    ],
  },
  socialIntro: {
    title: "Follow us on social media",
    tagline: "Don't miss a thing!",
    text: "We share projects, events, mentoring and ways to get involved on our social media.",
  },
};

const es: HomeContent = {
  hero: {
    title: "La Primera Liga de Ciencia y Tecnología de la PUC-SP",
  },
  numbers: "Nuestros números",
  hiredTitle: "Empresas que contrataron a nuestros miembros",
  about: {
    title: "Sobre nosotros",
    paragraphs: [
      "**PUC Tech** es la primera liga de ciencia y tecnología de la PUC-SP, formada por estudiantes que ven en el protagonismo estudiantil un motor de transformación. Creamos experiencias prácticas que unen teoría, tecnología e impacto social.",
      "Trabajamos con proyectos, talleres, eventos e iniciativas que desarrollan competencias técnicas, profesionales y humanas. Aquí, los estudiantes lideran, innovan y construyen soluciones reales para desafíos concretos, siempre en equipo.",
    ],
  },
  statLabels: [
    "Estudiantes ya pasaron por la liga",
    "Proyectos desarrollados",
    "Eventos realizados",
    "Empresas aliadas",
    "Estudiantes contratados",
  ],
  projectsIntro: {
    title: "Proyectos",
    text: "Soluciones aplicadas en IA, ingeniería de software, ciberseguridad e innovación social.",
  },
  partnersIntro: {
    title: "Aliados de PUC Tech",
    paragraphs: [
      "Creemos que la innovación se construye en comunidad.",
      "Contamos con el apoyo de empresas, organizaciones estudiantiles, startups y de la propia universidad para ampliar nuestro impacto.",
    ],
  },
  socialIntro: {
    title: "Síguenos en redes sociales",
    tagline: "¡No te pierdas ninguna novedad!",
    text: "Compartimos proyectos, eventos, mentorías y oportunidades para participar en nuestras redes sociales.",
  },
};

export const home: Record<Lang, HomeContent> = { pt, en, es };

// Números da home (os rótulos ficam em `statLabels`, em cada idioma, na mesma ordem).
export const stats = [
  { value: 65, suffix: "+" },
  { value: 10, suffix: "+" },
  { value: 20, suffix: "+" },
  { value: 5, suffix: "+" },
  { value: 30, suffix: "+" },
];

// Para mostrar o logo de um parceiro, coloque o arquivo em public/parceiros/
// e acrescente logo: "/parceiros/nome.png". Sem logo, aparece o nome em texto.
export const partners: { name: string; logo?: string; logoDark?: string; href?: string }[] = [
  { name: "PUC-SP", logo: "/parceiros/puc-sp.png", logoDark: "/parceiros/puc-sp-dark.png", href: "https://www.pucsp.br" },
  { name: "Amazon AWS", logo: "/parceiros/amazon-aws.svg", logoDark: "/parceiros/amazon-aws-dark.svg", href: "https://aws.amazon.com" },
  { name: "Blumi Talents", logo: "/parceiros/blumi-talents.png", logoDark: "/parceiros/blumi-talents-dark.png", href: "https://blumitalents.com" },
  { name: "Peacore", logo: "/parceiros/peacore.jpg", href: "https://peacore.com.br" },
  { name: "Conecta Devs", logo: "/parceiros/conecta-devs.jpg" },
  { name: "PUC Junior", logo: "/parceiros/puc-junior.png", logoDark: "/parceiros/puc-junior-dark.png", href: "https://pucjunior.com.br" },
  { name: "PUC Angels", logo: "/parceiros/puc-angels.webp", logoDark: "/parceiros/puc-angels-dark.webp", href: "https://pucangels.org" },
];

// Empresas que contrataram membros e ex-membros da liga (logo abaixo dos números da home).
// Só logos em SVG, em public/empresas/. `logoDark` é a versão para o modo escuro.
// `tier` é a faixa, como numa parede de patrocinadores: 1 em cima, com logos maiores; 2 embaixo.
// `shape` corrige logos que não são horizontais: "square" (Itaú) ou "stacked" (símbolo em
// cima e nome embaixo, como o do Einstein), para parecerem do tamanho dos outros da faixa.
export const hiredAt: {
  name: string;
  logo: string;
  logoDark?: string;
  href: string;
  tier: 1 | 2;
  shape?: "square" | "stacked";
}[] = [
  { name: "Microsoft", logo: "/empresas/microsoft.svg", logoDark: "/empresas/microsoft-dark.svg", href: "https://www.microsoft.com", tier: 1 },
  { name: "Itaú", logo: "/empresas/itau.svg", href: "https://www.itau.com.br", tier: 1, shape: "square" },
  { name: "BTG Pactual", logo: "/empresas/btg.svg", logoDark: "/empresas/btg-dark.svg", href: "https://www.btgpactual.com", tier: 1 },
  { name: "Safra", logo: "/empresas/safra.svg", logoDark: "/empresas/safra-dark.svg", href: "https://www.safra.com.br", tier: 1 },
  { name: "Vivo", logo: "/empresas/vivo.svg", logoDark: "/empresas/vivo-dark.svg", href: "https://www.vivo.com.br", tier: 1 },
  { name: "Banco do Brasil", logo: "/empresas/banco-do-brasil.svg", href: "https://www.bb.com.br", tier: 2 },
  { name: "Einstein", logo: "/empresas/einstein.svg", logoDark: "/empresas/einstein-dark.svg", href: "https://www.einstein.br", tier: 2, shape: "stacked" },
  { name: "Banco Pan", logo: "/empresas/banco-pan.svg", logoDark: "/empresas/banco-pan-dark.svg", href: "https://www.bancopan.com.br", tier: 2 },
  { name: "Serena", logo: "/empresas/serena.svg", logoDark: "/empresas/serena-dark.svg", href: "https://srna.co", tier: 2 },
  { name: "nstech", logo: "/empresas/nstech.svg", href: "https://nstech.com.br", tier: 2 },
];
