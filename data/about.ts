// Textos da página "Sobre Nós", em cada idioma. Para destacar uma palavra em negrito, use **assim**.
// Mudou um texto em português? Mude também em `en` e `es`, logo abaixo.

import type { Lang, T } from "@/lib/i18n";

// Ícone de cada valor (desenhos em app/[lang]/sobre/page.tsx), na ordem de `values.items`.
export const valueIcons = ["rocket", "people", "graduation", "idea", "globe"] as const;

const pt = {
  title: "Sobre nós",
  description:
    "Conheça a visão, os valores e a história da PUC Tech, a primeira liga de ciência e tecnologia da PUC-SP.",
  intro:
    "A PUC Tech busca conectar estudantes ao ecossistema da tecnologia por meio de projetos, eventos e iniciativas que desenvolvam competências técnicas, profissionais e humanas, preparando-os para os desafios reais do mercado e da inovação.",
  difference: {
    title: "Por que e como a PUC Tech faz a diferença?",
    items: [
      {
        title: "Acreditamos que estudantes podem gerar impacto real.",
        text: "Por isso, criamos um ambiente onde eles lideram projetos aplicados, enfrentam desafios da sociedade e crescem com propósito.",
      },
      {
        title: "Transformamos a universidade em uma jornada prática e inovadora.",
        text: "Organizamos eventos, promovemos conexões com o mercado e incentivamos o protagonismo estudantil.",
      },
      {
        title: "Nos inspiramos nos grandes hubs de tecnologia.",
        text: "Mesmo sendo liderada por alunos, a PUC Tech busca excelência técnica, colaboração e impacto social.",
      },
      {
        title: "Construímos uma ponte entre universidade e mercado.",
        text: "Nossas experiências vão além da sala de aula, unindo teoria, prática e desenvolvimento humano.",
      },
    ],
  },
  vision: {
    title: "Nossa Visão",
    text: "Ser **referência** dentro e fora da PUC-SP como uma comunidade universitária que forma **protagonistas em tecnologia**, conectando talentos ao **mercado**, à **pesquisa** e à **inovação** por meio da prática, da colaboração e do protagonismo estudantil.",
  },
  values: {
    title: "Valores que nos guiam",
    items: [
      { title: "Protagonismo Estudantil", text: "Estudantes no centro das decisões e criações." },
      { title: "Colaboração e Comunidade", text: "Diversidade de ideias e trabalho em equipe." },
      { title: "Excelência e Aprendizado Contínuo", text: "Busca por qualidade técnica e intelectual." },
      { title: "Inovação com Responsabilidade", text: "Tecnologia aplicada com ética e impacto." },
      { title: "Conexão com o Mundo Real", text: "Aproximação com desafios reais do mercado." },
    ],
  },
  history: {
    title: "História da PUC Tech",
    paragraphs: [
      "A PUC Tech surgiu da iniciativa de alunos de Ciência da Computação da PUC-SP que queriam um espaço para aplicar o que aprendem em projetos reais, desenvolver habilidades e se conectar com a tecnologia além da sala de aula.",
      "Fundada em 2024 e formalizada em 2025, a liga cresceu com o apoio de professores, coordenações e demais estudantes, e hoje se consolida como um polo de inovação e protagonismo estudantil dentro da universidade.",
    ],
  },
  support: {
    title: "Apoio Institucional",
    logoAlt: "Logo da PUC-SP",
    intro:
      "A PUC Tech é uma iniciativa constituída por alunos com o apoio de professores da PUC-SP. Acreditamos que o envolvimento institucional é essencial para ampliar nosso impacto e garantir a continuidade das ações.",
    backersIntro: "Contamos com o suporte de",
    backers: [
      "Diretoria da Faculdade de Ciências Exatas e Tecnologia",
      "Coordenação do Curso de Ciência da Computação",
      "Professores que atuam como tutores acadêmicos",
    ],
    closing: "Juntos, fortalecemos o elo entre ensino, pesquisa, extensão e prática.",
  },
};

type AboutContent = typeof pt;

const en: AboutContent = {
  title: "About us",
  description:
    "Learn about the vision, values and history of PUC Tech, the first science and technology league at PUC-SP.",
  intro:
    "PUC Tech connects students to the technology ecosystem through projects, events and initiatives that build technical, professional and human skills, preparing them for the real challenges of the market and of innovation.",
  difference: {
    title: "Why and how does PUC Tech make a difference?",
    items: [
      {
        title: "We believe students can make a real impact.",
        text: "That's why we've built an environment where they lead applied projects, take on society's challenges and grow with purpose.",
      },
      {
        title: "We turn university into a hands-on, innovative journey.",
        text: "We organize events, build connections with the industry and encourage student leadership.",
      },
      {
        title: "We take inspiration from the great tech hubs.",
        text: "Even though it's run by students, PUC Tech strives for technical excellence, collaboration and social impact.",
      },
      {
        title: "We build a bridge between university and industry.",
        text: "Our experiences go beyond the classroom, bringing together theory, practice and personal growth.",
      },
    ],
  },
  vision: {
    title: "Our Vision",
    text: "To be a **reference**, at PUC-SP and beyond, as a university community that shapes **leaders in technology**, connecting talent to the **industry**, to **research** and to **innovation** through practice, collaboration and student leadership.",
  },
  values: {
    title: "Values that guide us",
    items: [
      { title: "Student Leadership", text: "Students at the center of decisions and creations." },
      { title: "Collaboration and Community", text: "Diversity of ideas and teamwork." },
      { title: "Excellence and Continuous Learning", text: "Pursuing technical and intellectual quality." },
      { title: "Responsible Innovation", text: "Technology applied with ethics and impact." },
      { title: "Connection with the Real World", text: "Getting closer to the industry's real challenges." },
    ],
  },
  history: {
    title: "PUC Tech's History",
    paragraphs: [
      "PUC Tech was started by Computer Science students at PUC-SP who wanted a space to apply what they learn in real projects, develop their skills and connect with technology beyond the classroom.",
      "Founded in 2024 and formalized in 2025, the league has grown with the support of professors, program coordinators and fellow students, and is now established as a hub of innovation and student leadership at the university.",
    ],
  },
  support: {
    title: "Institutional Support",
    logoAlt: "PUC-SP logo",
    intro:
      "PUC Tech is an initiative run by students with the support of PUC-SP professors. We believe institutional involvement is essential to expand our impact and keep our work going.",
    backersIntro: "We're supported by",
    backers: [
      "The Dean's Office of the School of Exact Sciences and Technology",
      "The Computer Science Program Coordination",
      "Professors who serve as academic tutors",
    ],
    closing: "Together, we strengthen the link between teaching, research, outreach and practice.",
  },
};

const es: AboutContent = {
  title: "Sobre nosotros",
  description:
    "Conoce la visión, los valores y la historia de PUC Tech, la primera liga de ciencia y tecnología de la PUC-SP.",
  intro:
    "PUC Tech busca conectar a los estudiantes con el ecosistema de la tecnología a través de proyectos, eventos e iniciativas que desarrollen competencias técnicas, profesionales y humanas, preparándolos para los desafíos reales del mercado y de la innovación.",
  difference: {
    title: "¿Por qué y cómo PUC Tech marca la diferencia?",
    items: [
      {
        title: "Creemos que los estudiantes pueden generar un impacto real.",
        text: "Por eso creamos un entorno donde lideran proyectos aplicados, enfrentan desafíos de la sociedad y crecen con propósito.",
      },
      {
        title: "Convertimos la universidad en un recorrido práctico e innovador.",
        text: "Organizamos eventos, promovemos conexiones con el mercado e incentivamos el protagonismo estudiantil.",
      },
      {
        title: "Nos inspiramos en los grandes polos tecnológicos.",
        text: "Aunque está liderada por estudiantes, PUC Tech busca excelencia técnica, colaboración e impacto social.",
      },
      {
        title: "Construimos un puente entre la universidad y el mercado.",
        text: "Nuestras experiencias van más allá del aula, uniendo teoría, práctica y desarrollo humano.",
      },
    ],
  },
  vision: {
    title: "Nuestra Visión",
    text: "Ser un **referente** dentro y fuera de la PUC-SP como una comunidad universitaria que forma **protagonistas en tecnología**, conectando talentos con el **mercado**, la **investigación** y la **innovación** a través de la práctica, la colaboración y el protagonismo estudiantil.",
  },
  values: {
    title: "Valores que nos guían",
    items: [
      { title: "Protagonismo Estudiantil", text: "Estudiantes en el centro de las decisiones y creaciones." },
      { title: "Colaboración y Comunidad", text: "Diversidad de ideas y trabajo en equipo." },
      { title: "Excelencia y Aprendizaje Continuo", text: "Búsqueda de calidad técnica e intelectual." },
      { title: "Innovación con Responsabilidad", text: "Tecnología aplicada con ética e impacto." },
      { title: "Conexión con el Mundo Real", text: "Acercamiento a los desafíos reales del mercado." },
    ],
  },
  history: {
    title: "Historia de PUC Tech",
    paragraphs: [
      "PUC Tech nació por iniciativa de estudiantes de Ciencias de la Computación de la PUC-SP que querían un espacio para aplicar lo que aprenden en proyectos reales, desarrollar habilidades y conectarse con la tecnología más allá del aula.",
      "Fundada en 2024 y formalizada en 2025, la liga creció con el apoyo de profesores, coordinaciones y otros estudiantes, y hoy se consolida como un polo de innovación y protagonismo estudiantil dentro de la universidad.",
    ],
  },
  support: {
    title: "Apoyo Institucional",
    logoAlt: "Logo de la PUC-SP",
    intro:
      "PUC Tech es una iniciativa formada por estudiantes con el apoyo de profesores de la PUC-SP. Creemos que la participación institucional es esencial para ampliar nuestro impacto y garantizar la continuidad de nuestras acciones.",
    backersIntro: "Contamos con el apoyo de",
    backers: [
      "La Dirección de la Facultad de Ciencias Exactas y Tecnología",
      "La Coordinación de la Carrera de Ciencias de la Computación",
      "Profesores que actúan como tutores académicos",
    ],
    closing: "Juntos, fortalecemos el vínculo entre enseñanza, investigación, extensión y práctica.",
  },
};

export const about: Record<Lang, AboutContent> = { pt, en, es };

export const supportLogo = "/parceiros/puc-sp.jpg";

// Marcos da linha do tempo, em ordem. Sem `month`, o marco fica no começo do ano.
// O texto (`label`) e a descrição da foto (`photoAlt`) vão nos três idiomas.
export const milestones: {
  year: number;
  month?: number;
  day?: number;
  label: T;
  photo?: string;
  photoAlt?: T;
}[] = [
  {
    year: 2024,
    month: 8,
    label: { pt: "Fundação da liga", en: "The league is founded", es: "Fundación de la liga" },
    photo: "/sobre/fundacao-2025.jpg",
    photoAlt: {
      pt: "Fundadores da PUC Tech reunidos em volta de uma mesa, com o kanban da liga na tela",
      en: "PUC Tech's founders gathered around a table, with the league's kanban board on screen",
      es: "Fundadores de PUC Tech reunidos alrededor de una mesa, con el kanban de la liga en la pantalla",
    },
  },
  {
    year: 2024,
    month: 10,
    label: {
      pt: "Semana Acadêmica, com palestra do Google Cloud",
      en: "Academic Week, with a talk by Google Cloud",
      es: "Semana Académica, con una charla de Google Cloud",
    },
    photo: "/sobre/semana-academica-2024.jpg",
    photoAlt: {
      pt: "Alunos reunidos em sala de aula ao fim da palestra do Google Cloud",
      en: "Students gathered in a classroom after the Google Cloud talk",
      es: "Estudiantes reunidos en un aula al final de la charla de Google Cloud",
    },
  },
  { year: 2025, month: 4, label: { pt: "Formalização", en: "Formalization", es: "Formalización" } },
  {
    year: 2025,
    month: 6,
    day: 28,
    label: { pt: "Primeiro dia da PUC Tech", en: "PUC Tech's first day", es: "Primer día de PUC Tech" },
    photo: "/sobre/primeiro-dia-2025.jpg",
    photoAlt: {
      pt: "Membros da PUC Tech e professores reunidos em um auditório da PUC-SP",
      en: "PUC Tech members and professors gathered in a PUC-SP auditorium",
      es: "Miembros de PUC Tech y profesores reunidos en un auditorio de la PUC-SP",
    },
  },
  {
    year: 2025,
    month: 6,
    label: { pt: "1ª turma de trainees", en: "1st trainee cohort", es: "1.ª generación de trainees" },
  },
  {
    year: 2025,
    month: 8,
    day: 20,
    label: {
      pt: "Visita ao Workshop Integrativo (WI 35), na Poli-USP",
      en: "Visit to the Integrative Workshop (WI 35) at Poli-USP",
      es: "Visita al Workshop Integrativo (WI 35), en la Poli-USP",
    },
    photo: "/sobre/wi-35-2025.jpg",
    photoAlt: {
      pt: "Membros da PUC Tech no Workshop Integrativo, em frente ao painel do Start Carreiras",
      en: "PUC Tech members at the Integrative Workshop, in front of the Start Carreiras panel",
      es: "Miembros de PUC Tech en el Workshop Integrativo, frente al panel de Start Carreiras",
    },
  },
  {
    year: 2025,
    month: 10,
    label: {
      pt: "Organização da Semana Acadêmica",
      en: "Organizing the Academic Week",
      es: "Organización de la Semana Académica",
    },
    photo: "/sobre/semana-academica-2025.jpg",
    photoAlt: {
      pt: "Alunos e professores reunidos em uma sala de aula na Semana Acadêmica",
      en: "Students and professors gathered in a classroom during the Academic Week",
      es: "Estudiantes y profesores reunidos en un aula durante la Semana Académica",
    },
  },
  {
    year: 2025,
    month: 11,
    day: 24,
    label: { pt: "Visita à AWS", en: "Visit to AWS", es: "Visita a AWS" },
    photo: "/sobre/visita-aws-2025.jpg",
    photoAlt: {
      pt: "Grupo da PUC Tech em frente ao painel da Amazon no escritório da AWS",
      en: "The PUC Tech group in front of the Amazon panel at the AWS office",
      es: "El grupo de PUC Tech frente al panel de Amazon en la oficina de AWS",
    },
  },
  {
    year: 2026,
    month: 4,
    day: 18,
    label: {
      pt: "Processo seletivo: dinâmica em grupo",
      en: "Selection process: group dynamic",
      es: "Proceso de selección: dinámica grupal",
    },
    photo: "/sobre/dinamica-2026.jpg",
    photoAlt: {
      pt: "Candidatos em grupos durante a dinâmica do processo seletivo",
      en: "Candidates in groups during the selection process group dynamic",
      es: "Candidatos en grupos durante la dinámica del proceso de selección",
    },
  },
  {
    year: 2026,
    month: 7,
    label: { pt: "2ª turma de trainees", en: "2nd trainee cohort", es: "2.ª generación de trainees" },
  },
  {
    year: 2026,
    month: 10,
    label: {
      pt: "Organização da Semana Acadêmica",
      en: "Organizing the Academic Week",
      es: "Organización de la Semana Académica",
    },
    photo: "/sobre/semana-academica-2026.jpg",
    photoAlt: {
      pt: "Alunos, professores e membros da PUC Tech reunidos em sala de aula na Semana Acadêmica",
      en: "Students, professors and PUC Tech members gathered in a classroom during the Academic Week",
      es: "Estudiantes, profesores y miembros de PUC Tech reunidos en un aula durante la Semana Académica",
    },
  },
  {
    year: 2026,
    month: 9,
    day: 17,
    label: {
      pt: "Visita ao campus de engenharia do Google, no Butantã",
      en: "Visit to Google's engineering campus in Butantã",
      es: "Visita al campus de ingeniería de Google, en Butantã",
    },
    photo: "/sobre/visita-google-2026.jpg",
    photoAlt: {
      pt: "Membros da PUC Tech com camisetas da liga em frente ao logo do Google",
      en: "PUC Tech members in league T-shirts in front of the Google logo",
      es: "Miembros de PUC Tech con camisetas de la liga frente al logo de Google",
    },
  },
];
