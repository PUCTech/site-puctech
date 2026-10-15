// Textos, áreas, status e tipos dos projetos da PUC Tech.
//
// Os projetos em si ficam em content/projetos/, um arquivo .md por projeto
// (veja content/projetos/_modelo.md). Para adicionar um projeto, copie o modelo.

export const projectsPage = {
  title: "Projetos",
  intro:
    "A PUC Tech desenvolve projetos que conectam teoria e prática, sempre com foco em inovação, impacto real e desenvolvimento técnico dos membros.",
};

// `image` fica em public/projetos/areas/. `position` escolhe qual parte da foto
// aparece no card ("horizontal vertical", em porcentagem).
export const projectAreas = [
  {
    title: "Inteligência Artificial",
    text: "Aplicações práticas de IA e aprendizado de máquina em diferentes contextos (educação, meio ambiente, saúde etc.).",
    image: "/projetos/areas/inteligencia-artificial.jpg",
    position: "50% 40%",
  },
  {
    title: "Engenharia de Software",
    text: "Desenvolvimento de sistemas robustos com foco em boas práticas, escalabilidade e integração de tecnologias modernas.",
    image: "/projetos/areas/engenharia-de-software.jpg",
    position: "50% 30%",
  },
  {
    title: "Cibersegurança",
    text: "Projetos voltados à segurança de sistemas, detecção de fraudes, testes de penetração e conscientização digital.",
    image: "/projetos/areas/ciberseguranca.jpg",
    position: "50% 75%",
  },
  {
    title: "Dados e Pesquisa Aplicada",
    text: "Estudos e experimentações com foco em impacto social, análise de dados e visualização interativa.",
    image: "/projetos/areas/dados.jpg",
    position: "50% 50%",
  },
] as const;

export type ProjectArea = (typeof projectAreas)[number]["title"];

// `id` é o valor escrito no .md (campo status); `label` é o texto exibido no site.
export const projectStatuses = [
  { id: "em-andamento", label: "Em andamento" },
  { id: "concluido", label: "Concluído" },
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