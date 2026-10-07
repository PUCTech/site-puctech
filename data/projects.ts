// Projetos da PUC Tech. Aparecem no carrossel da Home e da página "Projetos".
//
// COMO EDITAR: adicione, edite ou apague objetos na lista `projects` (mais abaixo).
// A ordem da lista é a ordem do carrossel.
//
// Campos de cada projeto (só `title` e `description` são obrigatórios):
//   title       → nome do projeto
//   description → descrição (uma linha em branco separa os parágrafos)
//   image       → capa, ex.: "/projetos/nome-do-projeto.jpg" (arquivo em public/projetos/)
//   summary     → resumo breve, 1 ou 2 frases (aparece embaixo do carrossel)
//   period      → período, ex.: "2026.1"
//   area        → uma das 4 áreas de atuação (veja `projectAreas`)
//   tech        → stacks e ferramentas, ex.: ["Python", "React", "AWS"]
//   team        → equipe envolvida, ex.: ["Nome Sobrenome", "Nome Sobrenome"]
//   objective   → objetivo e escopo
//   results     → resultados e aprendizados
//   repo        → link do repositório ou da publicação
//
// Exemplo de projeto (copie, tire os "//" e preencha):
//   {
//     title: "Nome do Projeto",
//     summary: "Resumo breve em uma ou duas frases.",
//     image: "/projetos/nome-do-projeto.jpg",
//     period: "2026.1",
//     area: "Inteligência Artificial",
//     description: "Descrição do projeto.",
//     tech: ["Python", "React", "AWS"],
//     team: ["Nome Sobrenome", "Nome Sobrenome"],
//     objective: "Objetivo e escopo.",
//     results: "Resultados e aprendizados.",
//     repo: "https://github.com/...",
//   },

export const projectsPage = {
  title: "Projetos",
  intro:
    "A PUC Tech desenvolve projetos que conectam teoria e prática, sempre com foco em inovação, impacto real e desenvolvimento técnico dos membros.",
};

export const projectAreas = [
  {
    title: "Inteligência Artificial",
    text: "Aplicações práticas de IA e aprendizado de máquina em diferentes contextos (educação, meio ambiente, saúde etc.).",
  },
  {
    title: "Engenharia de Software",
    text: "Desenvolvimento de sistemas robustos com foco em boas práticas, escalabilidade e integração de tecnologias modernas.",
  },
  {
    title: "Cibersegurança",
    text: "Projetos voltados à segurança de sistemas, detecção de fraudes, testes de penetração e conscientização digital.",
  },
  {
    title: "Dados e Pesquisa Aplicada",
    text: "Estudos e experimentações com foco em impacto social, análise de dados e visualização interativa.",
  },
] as const;

export type ProjectArea = (typeof projectAreas)[number]["title"];

export type Project = {
  title: string;
  description: string;
  image?: string;
  summary?: string;
  period?: string;
  area?: ProjectArea;
  tech?: string[];
  team?: string[];
  objective?: string;
  results?: string;
  repo?: string;
};

export const projects: Project[] = [];