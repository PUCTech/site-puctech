// Textos, áreas, status e tipos dos projetos da PUC Tech.
//
// Os projetos em si ficam em content/projetos/, um arquivo .md por projeto
// (veja content/projetos/_modelo.md). Para adicionar um projeto, copie o modelo.
// As traduções ficam em content/projetos/en/ e content/projetos/es/, com o mesmo nome de arquivo.

import type { Lang, T } from "@/lib/i18n";

const pt = {
  title: "Projetos",
  intro:
    "A PUC Tech desenvolve projetos que conectam teoria e prática, sempre com foco em inovação, impacto real e desenvolvimento técnico dos membros.",
  description:
    "Conheça os projetos da PUC Tech: inteligência artificial, engenharia de software, cibersegurança e dados, sempre com foco em impacto real.",
  empty: "Em breve, os projetos da PUC Tech vão aparecer aqui.",
  sections: {
    description: "Sobre o projeto",
    objective: "Objetivo e escopo",
    results: "Resultados e aprendizados",
  },
  stack: "stack",
  team: "equipe",
  repo: "Ver repositório",
  next: "próximo projeto",
};

type ProjectsPage = typeof pt;

const en: ProjectsPage = {
  title: "Projects",
  intro:
    "PUC Tech builds projects that connect theory and practice, always focused on innovation, real impact and the technical growth of our members.",
  description:
    "Explore PUC Tech's projects: artificial intelligence, software engineering, cybersecurity and data, always focused on real impact.",
  empty: "PUC Tech's projects will show up here soon.",
  sections: {
    description: "About the project",
    objective: "Goal and scope",
    results: "Results and lessons learned",
  },
  stack: "stack",
  team: "team",
  repo: "View repository",
  next: "next project",
};

const es: ProjectsPage = {
  title: "Proyectos",
  intro:
    "PUC Tech desarrolla proyectos que conectan teoría y práctica, siempre con foco en la innovación, el impacto real y el desarrollo técnico de sus miembros.",
  description:
    "Conoce los proyectos de PUC Tech: inteligencia artificial, ingeniería de software, ciberseguridad y datos, siempre con foco en el impacto real.",
  empty: "Pronto aparecerán aquí los proyectos de PUC Tech.",
  sections: {
    description: "Sobre el proyecto",
    objective: "Objetivo y alcance",
    results: "Resultados y aprendizajes",
  },
  stack: "stack",
  team: "equipo",
  repo: "Ver repositorio",
  next: "siguiente proyecto",
};

export const projectsPage: Record<Lang, ProjectsPage> = { pt, en, es };

// `title` é o nome da área em português: é ele que vai no campo `area` do .md e escolhe o ícone.
// `name` e `text` são o que aparece no site, em cada idioma.
// `image` fica em public/projetos/areas/. `position` escolhe qual parte da foto
// aparece no card ("horizontal vertical", em porcentagem).
export const projectAreas = [
  {
    title: "Inteligência Artificial",
    name: { pt: "Inteligência Artificial", en: "Artificial Intelligence", es: "Inteligencia Artificial" },
    text: {
      pt: "Aplicações práticas de IA e aprendizado de máquina em educação, saúde e meio ambiente.",
      en: "Hands-on applications of AI and machine learning in education, health and the environment.",
      es: "Aplicaciones prácticas de IA y aprendizaje automático en educación, salud y medio ambiente.",
    },
    image: "/projetos/areas/inteligencia-artificial.jpg",
    position: "50% 40%",
  },
  {
    title: "Engenharia de Software",
    name: { pt: "Engenharia de Software", en: "Software Engineering", es: "Ingeniería de Software" },
    text: {
      pt: "Sistemas robustos, com boas práticas, escalabilidade e integração de tecnologias modernas.",
      en: "Robust systems built with good practices, scalability and modern technologies.",
      es: "Sistemas robustos, con buenas prácticas, escalabilidad e integración de tecnologías modernas.",
    },
    image: "/projetos/areas/engenharia-de-software.jpg",
    position: "50% 30%",
  },
  {
    title: "Cibersegurança",
    name: { pt: "Cibersegurança", en: "Cybersecurity", es: "Ciberseguridad" },
    text: {
      pt: "Segurança de sistemas, detecção de fraudes, testes de penetração e conscientização digital.",
      en: "Systems security, fraud detection, penetration testing and digital awareness.",
      es: "Seguridad de sistemas, detección de fraudes, pruebas de penetración y concientización digital.",
    },
    image: "/projetos/areas/ciberseguranca.jpg",
    position: "50% 75%",
  },
  {
    title: "Dados e Pesquisa Aplicada",
    name: { pt: "Dados e Pesquisa Aplicada", en: "Data and Applied Research", es: "Datos e Investigación Aplicada" },
    text: {
      pt: "Estudos com foco em impacto social, análise de dados e visualizações interativas para todos.",
      en: "Studies focused on social impact, data analysis and interactive visualizations for everyone.",
      es: "Estudios con foco en el impacto social, el análisis de datos y visualizaciones interactivas para todos.",
    },
    image: "/projetos/areas/dados.jpg",
    position: "50% 50%",
  },
] as const satisfies readonly { title: string; name: T; text: T; image: string; position: string }[];

export type ProjectArea = (typeof projectAreas)[number]["title"];

/** Nome da área no idioma da página. */
export const areaName = (area: ProjectArea | undefined, lang: Lang) =>
  area && projectAreas.find((item) => item.title === area)?.name[lang];

// `id` é o valor escrito no .md (campo status); `label` é o texto exibido no site
// (o /admin usa o português).
export const projectStatuses = [
  { id: "em-andamento", label: "Em andamento", name: { pt: "Em andamento", en: "In progress", es: "En curso" } },
  { id: "concluido", label: "Concluído", name: { pt: "Concluído", en: "Completed", es: "Finalizado" } },
] as const;

export type ProjectStatus = (typeof projectStatuses)[number]["id"];

export type Project = {
  slug: string; // nome do arquivo .md, sem a extensão (endereço: /projetos/slug)
  title: string;
  description: string;
  image?: string;
  summary?: string;
  period?: string;
  area?: ProjectArea;
  status?: ProjectStatus;
  tech?: string[];
  team?: string[];
  objective?: string;
  results?: string;
  repo?: string;
};
