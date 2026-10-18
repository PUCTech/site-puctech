import membersData from "@/content/membros.json";
import type { Lang, T } from "@/lib/i18n";

export type AreaId = "marketing" | "eventos" | "pessoas";

export type Group =
  | "orientador"
  | "honorario"
  | "fundador"
  | "presidente"
  | "vice-presidente"
  | "diretoria-estrategica"
  | "membro"
  | "trainee"
  | "idealizador";

// Grupos na ordem e com os nomes usados no /admin.
export const groups: { id: Group; label: string }[] = [
  { id: "orientador", label: "Tutor" },
  { id: "honorario", label: "Membro honorário" },
  { id: "fundador", label: "Fundador" },
  { id: "presidente", label: "Presidente" },
  { id: "vice-presidente", label: "Vice-presidente" },
  { id: "diretoria-estrategica", label: "Diretoria estratégica" },
  { id: "membro", label: "Membro" },
  { id: "trainee", label: "Trainee" },
  { id: "idealizador", label: "Idealizador" },
];

export type Member = {
  name: string;
  group: Group;
  cargo?: string;
  areas?: AreaId[];
  presidentOf?: AreaId[];
  viceOf?: AreaId[];
  photo?: string;
  linkedin?: string;
  inactive?: boolean; // já saiu da liga: some das listas do site, mas segue creditado nos projetos
};

export type AreaInfo = {
  id: AreaId;
  label: string; // nome no /admin
  name: T; // nome no site, em cada idioma
  description: string;
};

export const areaInfo: AreaInfo[] = [
  {
    id: "marketing",
    label: "Marketing",
    name: { pt: "Marketing", en: "Marketing", es: "Marketing" },
    description:
      "Cuida da comunicação, das redes sociais e da identidade visual da liga.",
  },
  {
    id: "eventos",
    label: "Eventos",
    name: { pt: "Eventos", en: "Events", es: "Eventos" },
    description:
      "Organiza palestras, workshops e encontros com empresas e profissionais.",
  },
  {
    id: "pessoas",
    label: "Pessoas",
    name: { pt: "Pessoas", en: "People", es: "Personas" },
    description:
      "Cuida da integração dos membros, da cultura e dos processos seletivos.",
  },
];

// A lista de pessoas fica em content/membros.json (uma pessoa por linha), editada
// pelo /admin ou à mão. A ordem da lista é a ordem em que aparecem no site.
export const allMembers = membersData as Member[];
// Todas as listas do site partem daqui: só quem ainda está na liga.
export const members = allMembers.filter((m) => !m.inactive);

// Confere a lista a cada build. Se algo estiver errado, o build falha com uma
// mensagem dizendo qual pessoa (posição na lista) tem o problema.
export function teamErrors(list: Member[]) {
  const errors: string[] = [];

  list.forEach((member, index) => {
    const who = `"${member.name}" (posição ${index + 1} da lista)`;
    const canHaveAreas = member.group === "membro" || member.group === "trainee";

    if (!canHaveAreas && member.areas) {
      errors.push(`${who}: areas só vale para group "membro" ou "trainee".`);
    }
    if (member.group !== "membro" && member.presidentOf) {
      errors.push(`${who}: presidentOf só vale para group "membro".`);
    }
    if (member.group !== "membro" && member.viceOf) {
      errors.push(`${who}: viceOf só vale para group "membro".`);
    }
  });

  return errors;
}

const errors = teamErrors(allMembers);
if (errors.length > 0) throw new Error(`Erro em content/membros.json:\n- ${errors.join("\n- ")}`);

export const advisors = members.filter((m) => m.group === "orientador");
export const honorary = members.filter((m) => m.group === "honorario");
export const founders = members.filter((m) => m.group === "fundador");
export const executive = members.filter(
  (m) => m.group === "presidente" || m.group === "vice-presidente",
);
export const strategic = members.filter(
  (m) => m.group === "diretoria-estrategica",
);
export const trainees = members.filter((m) => m.group === "trainee");
export const idealizers = members.filter((m) => m.group === "idealizador");
// Textos da página /membros, em cada idioma.
// Mudou um texto em português? Mude também em `en` e `es`, logo abaixo.
const pt = {
  title: "Membros",
  description:
    "Conheça os tutores, fundadores e a equipe atual da PUC Tech, a primeira liga de ciência e tecnologia da PUC-SP.",
  intro:
    "As pessoas que constroem a PUC Tech todos os dias, da orientação acadêmica aos estudantes que fazem a liga acontecer.",
  groupPhotoAlt: "Membros da PUC Tech reunidos",
  community:
    "A PUC Tech é formada por uma comunidade de estudantes engajados, orientadores e parceiros que acreditam no protagonismo estudantil como motor da transformação na universidade e na sociedade.",
  groups: {
    tutores: {
      title: "Tutores",
      text: "Professores da PUC-SP que atuam como ponte entre a liga e a universidade, apoiando pedagogicamente nossas ações.",
    },
    honorarios: {
      title: "Membros Honorários",
      text: "Convidados externos que contribuem com sua experiência técnica, visão estratégica e apoio institucional.",
    },
    fundadores: {
      title: "Fundadores",
      text: "Estudantes que idealizaram e fundaram a PUC Tech, estruturando sua base organizacional e seus primeiros projetos.",
    },
    organograma: {
      title: "Organograma",
      text: "Responsável pela gestão geral da liga, composta por presidente e vice-presidente.",
    },
    diretoriasEstrategicas: {
      title: "Diretorias Estratégicas",
      text: "Áreas focadas em ensino, pesquisa, extensão e desenvolvimento de projetos.",
    },
    integrantes: {
      title: "Integrantes",
      text: "Quem faz a PUC Tech acontecer no dia a dia. Filtre por área e clique em alguém para ver o LinkedIn.",
    },
    idealizadores: {
      title: "Idealizadores",
      text: "A PUC Tech surgiu em 2024 graças a diversos idealizadores que fizeram a diferença em sua história. Deixamos esta seção como um agradecimento a todos eles.",
    },
  },
  roles: {
    tutor: "Tutor",
    founder: "Fundador",
    honorary: "Membro honorário",
    member: "Membro",
    lead: "Coordenação",
    vice: "Vice-coordenação",
    // {area} vira o nome da área (no organograma).
    leadOf: "Coord. {area}",
    viceOf: "Vice-coord. {area}",
  },
  all: "Todos",
  filter: "Filtrar por área",
  photoOf: "Foto de",
  // O cargo de cada pessoa é escrito em português no /admin; aqui, a tradução dos que existem.
  // Cargo novo sem tradução aparece em português mesmo.
  cargos: {} as Record<string, string>,
};

type TeamContent = typeof pt;

const en: TeamContent = {
  title: "Members",
  description:
    "Meet the tutors, founders and current team of PUC Tech, the first science and technology league at PUC-SP.",
  intro: "The people who build PUC Tech every day, from academic advisors to the students who make the league happen.",
  groupPhotoAlt: "PUC Tech members together",
  community:
    "PUC Tech is a community of engaged students, advisors and partners who believe student leadership drives change at the university and in society.",
  groups: {
    tutores: {
      title: "Tutors",
      text: "PUC-SP professors who bridge the league and the university, supporting our work academically.",
    },
    honorarios: {
      title: "Honorary Members",
      text: "External guests who contribute their technical experience, strategic vision and institutional support.",
    },
    fundadores: {
      title: "Founders",
      text: "Students who envisioned and founded PUC Tech, building its organizational foundation and first projects.",
    },
    organograma: {
      title: "Organization Chart",
      text: "Responsible for running the league as a whole, made up of the president and vice president.",
    },
    diretoriasEstrategicas: {
      title: "Strategic Boards",
      text: "Areas focused on teaching, research, outreach and project development.",
    },
    integrantes: {
      title: "Team",
      text: "The people who make PUC Tech happen day to day. Filter by area and click on someone to see their LinkedIn.",
    },
    idealizadores: {
      title: "Visionaries",
      text: "PUC Tech came to life in 2024 thanks to many visionaries who made a difference in its history. This section is our thank-you to all of them.",
    },
  },
  roles: {
    tutor: "Tutor",
    founder: "Founder",
    honorary: "Honorary member",
    member: "Member",
    lead: "Lead",
    vice: "Vice Lead",
    leadOf: "{area} Lead",
    viceOf: "{area} Vice Lead",
  },
  all: "All",
  filter: "Filter by area",
  photoOf: "Photo of",
  cargos: { Presidente: "President", "Vice-presidente": "Vice President", Tutora: "Tutor", Tutor: "Tutor" },
};

const es: TeamContent = {
  title: "Miembros",
  description:
    "Conoce a los tutores, fundadores y al equipo actual de PUC Tech, la primera liga de ciencia y tecnología de la PUC-SP.",
  intro:
    "Las personas que construyen PUC Tech todos los días, desde la orientación académica hasta los estudiantes que hacen que la liga suceda.",
  groupPhotoAlt: "Miembros de PUC Tech reunidos",
  community:
    "PUC Tech está formada por una comunidad de estudiantes comprometidos, orientadores y aliados que creen en el protagonismo estudiantil como motor de transformación en la universidad y en la sociedad.",
  groups: {
    tutores: {
      title: "Tutores",
      text: "Profesores de la PUC-SP que actúan como puente entre la liga y la universidad, apoyando pedagógicamente nuestras acciones.",
    },
    honorarios: {
      title: "Miembros Honorarios",
      text: "Invitados externos que contribuyen con su experiencia técnica, visión estratégica y apoyo institucional.",
    },
    fundadores: {
      title: "Fundadores",
      text: "Estudiantes que idearon y fundaron PUC Tech, estructurando su base organizativa y sus primeros proyectos.",
    },
    organograma: {
      title: "Organigrama",
      text: "Responsable de la gestión general de la liga, compuesta por el presidente y el vicepresidente.",
    },
    diretoriasEstrategicas: {
      title: "Direcciones Estratégicas",
      text: "Áreas enfocadas en la enseñanza, la investigación, la extensión y el desarrollo de proyectos.",
    },
    integrantes: {
      title: "Integrantes",
      text: "Quienes hacen que PUC Tech funcione día a día. Filtra por área y haz clic en alguien para ver su LinkedIn.",
    },
    idealizadores: {
      title: "Idealizadores",
      text: "PUC Tech surgió en 2024 gracias a muchos idealizadores que marcaron la diferencia en su historia. Dejamos esta sección como agradecimiento a todos ellos.",
    },
  },
  roles: {
    tutor: "Tutor",
    founder: "Fundador",
    honorary: "Miembro honorario",
    member: "Miembro",
    lead: "Coordinación",
    vice: "Vicecoordinación",
    leadOf: "Coord. {area}",
    viceOf: "Vicecoord. {area}",
  },
  all: "Todos",
  filter: "Filtrar por área",
  photoOf: "Foto de",
  cargos: { Presidente: "Presidente", "Vice-presidente": "Vicepresidente", Tutora: "Tutora", Tutor: "Tutor" },
};

export const teamPage: Record<Lang, TeamContent> = { pt, en, es };

/** Cargo da pessoa no idioma da página (sem tradução, fica o texto do /admin). */
export const cargoIn = (cargo: string | undefined, lang: Lang) => cargo && (teamPage[lang].cargos[cargo] ?? cargo);
