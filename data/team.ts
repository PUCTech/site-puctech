import membersData from "@/content/membros.json";

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
  label: string;
  description: string;
};

export const areaInfo: AreaInfo[] = [
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Cuida da comunicação, das redes sociais e da identidade visual da liga.",
  },
  {
    id: "eventos",
    label: "Eventos",
    description:
      "Organiza palestras, workshops e encontros com empresas e profissionais.",
  },
  {
    id: "pessoas",
    label: "Pessoas",
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
export const groupDescriptions = {
  tutores:
    "Professores da PUC-SP que atuam como ponte entre a liga e a universidade, apoiando pedagogicamente nossas ações.",
  honorarios:
    "Convidados externos que contribuem com sua experiência técnica, visão estratégica e apoio institucional.",
  fundadores:
    "Estudantes que idealizaram e fundaram a PUC Tech, estruturando sua base organizacional e seus primeiros projetos.",
  diretoriaExecutiva:
    "Responsável pela gestão geral da liga, composta por presidente e vice-presidente.",
  diretoriasEstrategicas:
    "Áreas focadas em ensino, pesquisa, extensão e desenvolvimento de projetos.",
  areasOperacionais:
    "Coordenações que garantem o funcionamento e a comunicação da liga: Pessoas, Eventos e Marketing.",
  trainees:
    "Novos membros em formação, que participam de um programa de imersão e desenvolvimento prático dentro da liga.",
  idealizadores:
    "A PUC Tech surgiu em 2024 graças a diversos idealizadores que fizeram a diferença em sua história. Deixamos esta seção como um agradecimento a todos eles.",
};