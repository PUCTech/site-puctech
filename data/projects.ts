// Projetos da PUC Tech. Aparecem no carrossel da página "Projetos".
//
// COMO EDITAR: adicione, edite ou apague objetos na lista `projects` (mais abaixo).
// A ordem da lista é a ordem do carrossel.
//
// Campos de cada projeto (só `title` e `description` são obrigatórios):
//   title       → nome do projeto (deve ser único)
//   description → descrição (use \n\n para separar parágrafos)
//   image       → capa, ex.: "/projetos/nome-do-projeto.jpg" (arquivo em public/projetos/)
//   summary     → resumo breve, 1 ou 2 frases (aparece embaixo do carrossel)
//   period      → período, ex.: "2026.1"
//   area        → uma das 4 áreas de atuação (veja `projectAreas`)
//   tech        → stacks e ferramentas, ex.: ["Python", "React", "AWS"]
//   team        → equipe envolvida
//   objective   → objetivo e escopo
//   results     → resultados e aprendizados
//   repo        → link do repositório ou da publicação

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

export const projects: Project[] = [
  {
    title: "CareOn",
    summary:
      "Aplicativo de gestão de saúde rotineira: remédios, compromissos de saúde e consulta de preços.",
    area: "Engenharia de Software",
    description:
      "O CareOn ajuda a organizar a saúde no dia a dia. No app é possível cadastrar remédios, cadastrar compromissos de saúde (como exames e cirurgias), marcar os remédios já tomados e pesquisar o preço de remédios na Drogasil.\n\nOs preços vêm do site da farmácia e podem variar. Projeto desenvolvido em equipe, com foco no aprendizado prático.",
    tech: [
      "React Native",
      "Expo",
      "TypeScript",
      "Python",
      "Django",
      "PostgreSQL",
      "Supabase",
      "Render",
      "Web Scraping",
      "APIs REST",
    ],
    team: ["Pedro Bizzari", "Liam Vedovato Lopes", "João Vitor P Bicalho"],
    objective:
      "Construir uma aplicação funcional de gestão de saúde rotineira, com app mobile em React Native, API REST em Django, banco de dados PostgreSQL no Supabase e web scraping para a consulta de preços.",
    results:
      "Aplicativo Android com build gerado pelo Expo.\n\nAprendizados: composição e organização de telas, integração do front-end com a API, autenticação por token e validação de dados, desenvolvimento de APIs REST, web scraping, uso do Supabase e deploy do back-end.",
    repo: "https://github.com/PedroBZR12/careon",
  },
  {
    title: "Minerva",
    summary:
      "Aplicativo para organizar a vida acadêmica: disciplinas, notas, faltas, tarefas e arquivos.",
    area: "Engenharia de Software",
    description:
      "O Minerva nasceu para ajudar o estudante universitário a planejar melhor a rotina acadêmica. Inspirado na deusa da sabedoria, reúne em um único espaço disciplinas, conteúdos, notas, faltas e arquivos.\n\nÉ uma solução de estudantes para estudantes, pensada para a experiência real do universitário brasileiro, e foi feita no programa First Steps da PUC Tech.",
    tech: [
      "Java",
      "Spring",
      "Python",
      "Streamlit",
      "PostgreSQL",
      "H2",
      "JWT",
      "Docker",
      "Figma",
      "Diagrams.net",
    ],
    team: [
      "Kauã Bezerra Brito",
      "Luis Augusto Coelho de Souza",
      "Tulio Goncalves Vieira",
    ],
    objective:
      "Combater a desorganização acadêmica com gestão de disciplinas (créditos, carga horária e média necessária), controle de notas com pesos e média em tempo real, controle de faltas com o limite calculado pela carga horária, agenda de tarefas, provas e prazos e gestão de arquivos.",
    results:
      "Versão de produção publicada na nuvem, com back-end em Spring, front-end em Streamlit e autenticação por JWT.",
    repo: "https://github.com/Luis-coelho30/minerva-app",
  },
  {
    title: "Rothernet",
    summary:
      "Restaurante virtual com agente de IA que atende o cliente por voz, em português.",
    area: "Inteligência Artificial",
    description:
      "O Rothernet simula o atendimento de um restaurante com um agente virtual de IA e Realidade Mista. O cliente conversa por voz com o assistente, que entende pedidos, responde perguntas sobre o cardápio e as regras da casa e devolve a resposta em áudio, em português.\n\nÉ um dos projetos iniciais (First Steps) da PUC Tech.",
    tech: [
      "Unity",
      "Python",
      "FastAPI",
      "WebSockets",
      "LangChain",
      "ChromaDB",
      "OpenAI",
      "Whisper",
      "SQLAlchemy",
      "PostgreSQL",
      "Supabase",
      "Railway",
    ],
    team: ["@schnekenberg", "@GaiaOcean", "@Niikira", "@Ce-22"],
    objective:
      "Criar um atendimento automatizado e amigável por voz: a fala do cliente é transcrita (Whisper), a IA responde com base nos documentos do restaurante (RAG com LangChain e ChromaDB), a resposta vira áudio e cada cliente mantém seu histórico de conversa e de pedidos a partir de um User ID.",
    repo: "https://github.com/schnekenberg/puctech_rothernet",
  },
];