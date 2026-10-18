// Textos da interface que aparecem em várias páginas (menu, rodapé, botões).
// Os textos de cada página ficam no arquivo dela em data/.

import type { Lang } from "@/lib/i18n";

const pt = {
  site: {
    title: "PUC Tech | A Primeira Liga de Ciência e Tecnologia da PUC-SP",
    tagline: "A Primeira Liga de Ciência e Tecnologia da PUC-SP",
    description:
      "A primeira liga de ciência e tecnologia da PUC-SP, formada por estudantes que acreditam no protagonismo estudantil como motor de transformação.",
  },
  nav: {
    home: "Home",
    about: "Sobre Nós",
    members: "Membros",
    projects: "Projetos",
    selection: "Processo Seletivo",
  },
  header: {
    logo: "Logo da PUC Tech",
    openMenu: "Abrir menu",
    language: "Idioma",
    theme: "Alternar tema claro e escuro",
    themeShort: "Alternar tema",
  },
  footer: { home: "PUC Tech, página inicial", label: "Rodapé" },
  allLinks: "Nossos links",
  newTab: "abre em nova aba",
  notFound: {
    title: "Página não encontrada",
    text: "O endereço pode ter mudado ou não existe mais.",
    back: "Voltar para o início",
  },
};

export type Ui = typeof pt;

const en: Ui = {
  site: {
    title: "PUC Tech | The First Science and Technology League at PUC-SP",
    tagline: "The First Science and Technology League at PUC-SP",
    description:
      "The first science and technology league at PUC-SP, made up of students who believe student leadership drives change.",
  },
  nav: {
    home: "Home",
    about: "About Us",
    members: "Members",
    projects: "Projects",
    selection: "Selection Process",
  },
  header: {
    logo: "PUC Tech logo",
    openMenu: "Open menu",
    language: "Language",
    theme: "Switch between light and dark theme",
    themeShort: "Switch theme",
  },
  footer: { home: "PUC Tech, home page", label: "Footer" },
  allLinks: "Our links",
  newTab: "opens in a new tab",
  notFound: {
    title: "Page not found",
    text: "The address may have changed or no longer exists.",
    back: "Back to the home page",
  },
};

const es: Ui = {
  site: {
    title: "PUC Tech | La Primera Liga de Ciencia y Tecnología de la PUC-SP",
    tagline: "La Primera Liga de Ciencia y Tecnología de la PUC-SP",
    description:
      "La primera liga de ciencia y tecnología de la PUC-SP, formada por estudiantes que creen en el protagonismo estudiantil como motor de transformación.",
  },
  nav: {
    home: "Inicio",
    about: "Sobre Nosotros",
    members: "Miembros",
    projects: "Proyectos",
    selection: "Proceso de Selección",
  },
  header: {
    logo: "Logo de PUC Tech",
    openMenu: "Abrir menú",
    language: "Idioma",
    theme: "Cambiar entre tema claro y oscuro",
    themeShort: "Cambiar tema",
  },
  footer: { home: "PUC Tech, página de inicio", label: "Pie de página" },
  allLinks: "Nuestros enlaces",
  newTab: "se abre en una pestaña nueva",
  notFound: {
    title: "Página no encontrada",
    text: "Puede que la dirección haya cambiado o ya no exista.",
    back: "Volver al inicio",
  },
};

export const ui: Record<Lang, Ui> = { pt, en, es };
