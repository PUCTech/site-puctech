// COMO EDITAR A EQUIPE: tudo fica na lista `members` mais abaixo.
//   • Adicionar  → copie uma linha, cole na lista e mude os dados.
//   • Editar     → altere os campos na linha da pessoa.
//   • Remover    → apague a linha da pessoa.
// A ordem da lista é a ordem em que as pessoas aparecem no site.
//
// Campos:
//   name        → nome (obrigatório)
//   group       → obrigatório. Um destes:
//                 "orientador"      → seção Orientadores
//                 "fundador"        → seção Fundadores
//                 "presidente"      → presidente geral da liga (sem área)
//                 "vice-presidente" → vice-presidente da liga (sem área)
//                 "membro"          → membro da equipe atual
//                 "trainee"         → trainee da equipe atual
//   areas       → áreas em que a pessoa é membro/trainee: "marketing", "eventos", "pessoas"
//                 (pode ter uma, várias ou nenhuma; sem área, só aparece na aba Geral)
//   presidentOf → áreas que a pessoa preside (só para group "membro")
//   photo       → ex.: "/equipe/nome.jpg" (arquivo em public/equipe/)
//   linkedin    → com ele, o cartão inteiro vira um link
//
// Quem preside uma área já pertence a ela, não precisa repetir em `areas`.
//
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
//
// Quem é fundador (ou orientador) e também faz parte da equipe atual ganha duas linhas, uma de cada group.

export type AreaId = "marketing" | "eventos" | "pessoas";

export type Group =
  | "orientador"
  | "fundador"
  | "presidente"
  | "vice-presidente"
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
  { name: "Profa. Cristiana", group: "orientador", photo: "/equipe/profa-cristiana.jpg", linkedin: "http://lattes.cnpq.br/9085326429110439" },
  { name: "Prof. Daniel Gatti", group: "orientador", photo: "/equipe/prof-daniel-gatti.jpg", linkedin: "https://www.linkedin.com/in/dgatti/" },

  // Fundadores
  { name: "Igor Simões", group: "fundador", photo: "/equipe/igor-simoes.jpg", linkedin: "https://www.linkedin.com/in/igorssimoes/" },
  { name: "Leonardo Grupioni", group: "fundador", photo: "/equipe/leonardo-grupioni.jpg", linkedin: "https://www.linkedin.com/in/leonardo-grupioni-5929941aa/" },
  { name: "René Lopes", group: "fundador", photo: "/equipe/rene-lopes.jpg", linkedin: "https://www.linkedin.com/in/ren%C3%A9-l-silva-06a293189/" },

  // Diretoria
  { name: "Luís Augusto", group: "presidente", photo: "/equipe/luis-augusto.jpg", linkedin: "https://www.linkedin.com/in/lu%C3%ADs-augusto-coelho-de-souza-5b5324324/" },
  { name: "Kauã Bezerra", group: "vice-presidente", photo: "/equipe/kaua-bezerra.jpg", linkedin: "https://www.linkedin.com/in/kau%C3%A3-bezerra-88a0921b0/" },

  // Membros
  { name: "Guilherme Coutinho", group: "membro", areas: ["eventos"], photo: "/equipe/guilherme-coutinho.jpg", linkedin: "https://www.linkedin.com/in/guicoutinho/" },
  { name: "Guilherme Pequeneza", group: "membro", areas: ["eventos"], photo: "/equipe/guilherme-pequeneza.jpg", linkedin: "https://www.linkedin.com/in/guilherme-pequeneza-2b1132366/" },
  { name: "Liam Lopes", group: "membro", areas: ["eventos"], photo: "/equipe/liam-lopes.jpg", linkedin: "https://www.linkedin.com/in/liam-lopes-8250b1214/" },
  { name: "Raul Kolaric", group: "membro", areas: ["marketing"], photo: "/equipe/raul-kolaric.jpg", linkedin: "https://www.linkedin.com/in/raulkolaric/" },
  { name: "Vitor Seiji", group: "membro", photo: "/equipe/vitor-seiji.jpg", linkedin: "https://www.linkedin.com/in/vitor-seiji-17809b389/" },

  // Trainees
  { name: "Ana Paula", group: "trainee", photo: "/equipe/ana-paula.jpg" },
  { name: "Bruna Samy", group: "trainee", photo: "/equipe/bruna-samy.jpg", linkedin: "https://www.linkedin.com/in/brunasamyfreming/" },
  { name: "Davi Bastyi", group: "trainee", photo: "/equipe/davi-bastyi.jpg" },
  { name: "Felipe Correia", group: "trainee", linkedin: "https://www.linkedin.com/in/felipe-urzi-04021b34a/" },
  { name: "Gabriel Almeida", group: "trainee", photo: "/equipe/gabriel-almeida.jpg", linkedin: "https://www.linkedin.com/in/gabriel-almeida-115877410/" },
  { name: "Heitor Cavalcanti", group: "trainee", photo: "/equipe/heitor-cavalcanti.jpg", linkedin: "https://www.linkedin.com/in/heitorscavalcanti/" },
  { name: "Hellen Araujo", group: "trainee", photo: "/equipe/hellen-araujo.jpg", linkedin: "https://www.linkedin.com/in/hellen-araujo-da-silva-550b86322/" },
  { name: "Henrique Campos", group: "trainee", photo: "/equipe/henrique-campos.jpg", linkedin: "https://www.linkedin.com/in/henrique-campos-rodrigues-578927328/" },
  { name: "Igor Dias", group: "trainee", photo: "/equipe/igor-dias.jpg", linkedin: "https://www.linkedin.com/in/igor-dias-7355773b3/" },
  { name: "Isabella Fleury", group: "trainee", photo: "/equipe/isabella-fleury.jpg", linkedin: "https://www.linkedin.com/in/isabella-fleury-b756b83b4/" },
  { name: "João Gabriel", group: "trainee", photo: "/equipe/joao-gabriel.jpg", linkedin: "https://www.linkedin.com/in/jo%C3%A3o-gabriel-reis-silva-212707410/" },
  { name: "João Vitor", group: "trainee", photo: "/equipe/joao-vitor.jpg", linkedin: "https://www.linkedin.com/in/jo%C3%A3o-vitor-quintella/" },
  { name: "Leopoldo", group: "trainee", photo: "/equipe/leopoldo.jpg", linkedin: "https://www.linkedin.com/in/leopoldo-ortuzal-zuchieri-7a98a8410/" },
  { name: "Lorenzo", group: "trainee", photo: "/equipe/lorenzo.jpg", linkedin: "https://www.linkedin.com/in/lorenzo-cunha-032a9a3a7/" },
  { name: "Pedro Cione", group: "trainee", linkedin: "https://www.linkedin.com/in/pedrocione/" },
  { name: "Pedro Henrique", group: "trainee", photo: "/equipe/pedro-henrique.jpg", linkedin: "https://www.linkedin.com/in/pedrofpereira/" },
  { name: "Pedro Murakami", group: "trainee", photo: "/equipe/pedro-murakami.jpg", linkedin: "https://www.linkedin.com/in/pedro-vama-murakami/" },
  { name: "Pedru Paulo", group: "trainee", photo: "/equipe/pedru-paulo.jpg", linkedin: "https://www.linkedin.com/in/pedru-paulo-c-gama-02633b399/" },
  { name: "Rafael Infantini", group: "trainee", photo: "/equipe/rafael-infantini.jpg", linkedin: "https://www.linkedin.com/in/rbinfantini/" },
  { name: "Rafael Taffo", group: "trainee", photo: "/equipe/rafael-taffo.jpg", linkedin: "https://www.linkedin.com/in/rafael-taffo-montanha-5a11093bb/" },
  { name: "Rafaella Castro", group: "trainee", photo: "/equipe/rafaella-castro.jpg", linkedin: "https://www.linkedin.com/in/rafaellazlima/" },
  { name: "Renato Corral", group: "trainee", photo: "/equipe/renato-corral.jpg", linkedin: "https://www.linkedin.com/in/renatocorralsilva/" },
  { name: "Thierry", group: "trainee", photo: "/equipe/thierry.jpg", linkedin: "https://www.linkedin.com/in/thierry-nadjarian-a33a4a347/" },
  { name: "Victoria Tavares", group: "trainee", photo: "/equipe/victoria-tavares.jpg", linkedin: "https://www.linkedin.com/in/victoria-tavares-877808411/" },
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