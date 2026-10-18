// Textos da página "Processo Seletivo", em cada idioma. Texto entre **dois asteriscos** vira negrito.
// Mudou um texto em português? Mude também em `en` e `es`, logo abaixo.

import type { Lang } from "@/lib/i18n";

// Link do processo seletivo. Enquanto estiver vazio, o botão aparece desativado
// com o texto "em breve". Quando houver o link, cole aqui dentro das aspas
// (ex.: "https://forms.gle/...") e o botão passa a funcionar, em todos os idiomas.
export const applyUrl = "";

// Curso recomendado e o vídeo que toca na página: o id do YouTube (o que vem
// depois de youtu.be/) e a playlist.
export const cs50 = {
  url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
  video: {
    id: "h6lqxDwUmJQ",
    playlist: "PLhQjrBD2T383q7Vn8QnTsVgSvyLpsqL_R",
    title: "CS50x 2025 - Introduction",
  },
};

const pt = {
  title: "Processo Seletivo",
  description:
    "Saiba como se preparar para o próximo processo seletivo da PUC Tech, previsto para o primeiro semestre de 2027.",
  // Etiqueta em destaque abaixo do título.
  badge: "Próximo processo: 1º semestre de 2027",
  intro:
    "Se você é aluno da PUC-SP e ficou interessado em fazer parte da PUC Tech, já pode se preparar para o nosso próximo processo seletivo, que acontecerá no **primeiro semestre de 2027**.",
  prepare: {
    title: "Como se preparar",
    text: "Para se adiantar, recomendamos o curso **CS50 de Harvard**. Ele vai te dar base em diversos conteúdos que abordamos na liga, permitindo que você participe dos nossos projetos e iniciativas!",
    linkLabel: "Conhecer o CS50",
  },
  applyLabel: "Acessar o processo seletivo",
  soonLabel: "Link do processo seletivo — em breve",
};

type SelectionContent = typeof pt;

const en: SelectionContent = {
  title: "Selection Process",
  description:
    "Find out how to prepare for PUC Tech's next selection process, planned for the first semester of 2027.",
  badge: "Next selection process: 1st semester of 2027",
  intro:
    "If you're a PUC-SP student and want to be part of PUC Tech, you can start preparing now for our next selection process, which will take place in the **first semester of 2027**.",
  prepare: {
    title: "How to prepare",
    text: "To get a head start, we recommend **Harvard's CS50** course. It covers much of what we work with in the league, so you'll be ready to join our projects and initiatives!",
    linkLabel: "Check out CS50",
  },
  applyLabel: "Go to the selection process",
  soonLabel: "Selection process link — coming soon",
};

const es: SelectionContent = {
  title: "Proceso de Selección",
  description:
    "Descubre cómo prepararte para el próximo proceso de selección de PUC Tech, previsto para el primer semestre de 2027.",
  badge: "Próximo proceso: 1.er semestre de 2027",
  intro:
    "Si eres estudiante de la PUC-SP y te interesa formar parte de PUC Tech, ya puedes prepararte para nuestro próximo proceso de selección, que se realizará en el **primer semestre de 2027**.",
  prepare: {
    title: "Cómo prepararte",
    text: "Para adelantarte, te recomendamos el curso **CS50 de Harvard**. Te dará una base en muchos de los temas que trabajamos en la liga, para que puedas participar en nuestros proyectos e iniciativas.",
    linkLabel: "Conocer CS50",
  },
  applyLabel: "Ir al proceso de selección",
  soonLabel: "Enlace del proceso de selección — próximamente",
};

export const selection: Record<Lang, SelectionContent> = { pt, en, es };
