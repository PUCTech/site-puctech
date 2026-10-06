// COMO EDITAR A EQUIPE: tudo fica na lista `members` mais abaixo.
//   • Adicionar  → copie uma linha, cole na lista e mude os dados.
//   • Editar     → altere os campos na linha da pessoa.
//   • Remover    → apague a linha da pessoa.
// A ordem da lista é a ordem em que as pessoas aparecem no site.

// Campos:
//   name        → nome (obrigatório)
//   group       → obrigatório. Um destes:
//                 "orientador"  → seção Orientadores
//                 "fundador"    → seção Fundadores
//                 "presidente"  → presidente geral da liga (sem área)
//                 "membro"      → membro da equipe atual
//                 "trainee"     → trainee da equipe atual
//   areas       → áreas em que a pessoa é membro/trainee: "marketing", "eventos", "pessoas"
//                 (pode ter uma, várias ou nenhuma; sem área, só aparece na aba Geral)
//   presidentOf → áreas que a pessoa preside (só para group "membro")
//   photo       → ex.: "/equipe/nome.jpg" (arquivo em public/equipe/)
//   linkedin    → com ele, o cartão inteiro vira um link

// Quem preside uma área já pertence a ela, não precisa repetir em `areas`.

// Exemplos de linha:
//   { name: "Ana", group: "orientador" },
//   { name: "Bia", group: "fundador", linkedin: "https://..." },
//   { name: "Hana", group: "presidente" },                                         // presidente geral
//   { name: "Caio", group: "membro", areas: ["marketing"] },                       // membro de uma área
//   { name: "Duda", group: "membro", areas: ["marketing", "eventos"] },            // membro de duas áreas
//   { name: "Edu", group: "membro", presidentOf: ["eventos"] },                    // presidente de Eventos
//   { name: "Fê", group: "membro", areas: ["marketing"], presidentOf: ["eventos"] }, // membro de Marketing e presidente de Eventos
//   { name: "Gil", group: "membro" },                                              // membro sem área
//   { name: "Iara", group: "trainee", areas: ["pessoas"] },                        // trainee de Pessoas
//   { name: "João", group: "trainee" },                                            // trainee sem área

// Quem é fundador (ou orientador) e também faz parte da equipe atual ganha duas linhas, uma de cada group.

export type AreaId = "marketing" | "eventos" | "pessoas";

export type Group =
  | "orientador"
  | "fundador"
  | "presidente"
  | "membro"
  | "trainee";

export type Member = {
  name: string;
  group: Group;
  areas?: AreaId[];
  presidentOf?: AreaId[];
  photo?: string;
  linkedin?: string;
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

export const members: Member[] = [
  // Orientadores
  { name: "Exemplo", group: "orientador" },
  { name: "Exemplo", group: "orientador" },

  // Fundadores
  { name: "Exemplo", group: "fundador" },
  { name: "Exemplo", group: "fundador" },
  { name: "Exemplo", group: "fundador" },

  // Marketing
  { name: "Exemplo", group: "membro", presidentOf: ["marketing"] },
  { name: "Exemplo", group: "membro", presidentOf: ["marketing"] },
  { name: "Exemplo", group: "membro", areas: ["marketing"] },
  { name: "Exemplo", group: "membro", areas: ["marketing"] },
  { name: "Exemplo", group: "membro", areas: ["marketing"] },
  { name: "Exemplo", group: "membro", areas: ["marketing"] },

  // Eventos
  { name: "Exemplo", group: "membro", presidentOf: ["eventos"] },
  { name: "Exemplo", group: "membro", areas: ["eventos"] },
  { name: "Exemplo", group: "membro", areas: ["eventos"] },
  { name: "Exemplo", group: "membro", areas: ["eventos"] },
  { name: "Exemplo", group: "membro", areas: ["eventos"] },

  // Pessoas
  { name: "Exemplo", group: "membro", presidentOf: ["pessoas"] },
  { name: "Exemplo", group: "membro", presidentOf: ["pessoas"] },
  { name: "Exemplo", group: "membro", areas: ["pessoas"] },
  { name: "Exemplo", group: "membro", areas: ["pessoas"] },
  { name: "Exemplo", group: "membro", areas: ["pessoas"] },
];

// Confere a lista a cada build. Se algo estiver errado, o build falha com uma
// mensagem dizendo qual pessoa (posição na lista) tem o problema.
function validateTeam(list: Member[]) {
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
  });

  if (errors.length > 0) {
    throw new Error(`Erro em data/team.ts:\n- ${errors.join("\n- ")}`);
  }
}

validateTeam(members);

export const advisors = members.filter((m) => m.group === "orientador");
export const founders = members.filter((m) => m.group === "fundador");