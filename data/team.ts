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

export type Member = {
  name: string;
  group: Group;
  cargo?: string;
  areas?: AreaId[];
  presidentOf?: AreaId[];
  viceOf?: AreaId[];
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
  { name: "Luís Augusto", group: "presidente", cargo: "Presidente", photo: "/equipe/luis-augusto.jpg", linkedin: "https://www.linkedin.com/in/lu%C3%ADs-augusto-coelho-de-souza-5b5324324/" },
  { name: "Kauã Bezerra", group: "vice-presidente", cargo: "Vice-presidente", photo: "/equipe/kaua-bezerra.jpg", linkedin: "https://www.linkedin.com/in/kau%C3%A3-bezerra-88a0921b0/" },

  // Membros
  { name: "Guilherme Coutinho", group: "membro", areas: ["eventos"], photo: "/equipe/guilherme-coutinho.jpg", linkedin: "https://www.linkedin.com/in/guicoutinho/" },
  { name: "Guilherme Pequeneza", group: "membro", areas: ["eventos"], photo: "/equipe/guilherme-pequeneza.jpg", linkedin: "https://www.linkedin.com/in/guilherme-pequeneza-2b1132366/" },
  { name: "Hellen Araujo", group: "membro", areas: ["pessoas"], photo: "/equipe/hellen-araujo.jpg", linkedin: "https://www.linkedin.com/in/hellen-araujo-da-silva-550b86322/" },
  { name: "Henrique Campos", group: "membro", areas: ["eventos"], photo: "/equipe/henrique-campos.jpg", linkedin: "https://www.linkedin.com/in/henrique-campos-rodrigues-578927328/" },
  { name: "Isabella Fleury", group: "membro", presidentOf: ["marketing"], photo: "/equipe/isabella-fleury.jpg", linkedin: "https://www.linkedin.com/in/isabella-fleury-b756b83b4/" },
  { name: "João Vitor", group: "membro", areas: ["eventos"], photo: "/equipe/joao-vitor.jpg", linkedin: "https://www.linkedin.com/in/jo%C3%A3o-vitor-quintella/" },
  { name: "Liam Lopes", group: "membro", photo: "/equipe/liam-lopes.jpg", linkedin: "https://www.linkedin.com/in/liam-lopes-8250b1214/" },
  { name: "Lorenzo", group: "membro", areas: ["pessoas", "eventos"], photo: "/equipe/lorenzo.jpg", linkedin: "https://www.linkedin.com/in/lorenzo-cunha-032a9a3a7/" },
  { name: "Rafaella Castro", group: "membro", viceOf: ["marketing"], photo: "/equipe/rafaella-castro.jpg", linkedin: "https://www.linkedin.com/in/rafaellazlima/" },
  { name: "Raul Kolaric", group: "membro", areas: ["eventos"], photo: "/equipe/raul-kolaric.jpg", linkedin: "https://www.linkedin.com/in/raulkolaric/" },
  { name: "Renato Corral", group: "membro", areas: ["eventos"], photo: "/equipe/renato-corral.jpg", linkedin: "https://www.linkedin.com/in/renatocorralsilva/" },
  { name: "Thierry", group: "membro", areas: ["eventos"], photo: "/equipe/thierry.jpg", linkedin: "https://www.linkedin.com/in/thierry-nadjarian-a33a4a347/" },

  // Trainees
  { name: "Bruna Samy", group: "trainee", photo: "/equipe/bruna-samy.jpg", linkedin: "https://www.linkedin.com/in/brunasamyfreming/" },
  { name: "Felipe Correia", group: "trainee", linkedin: "https://www.linkedin.com/in/felipe-urzi-04021b34a/" },
  { name: "Gabriel Almeida", group: "trainee", areas: ["eventos"], photo: "/equipe/gabriel-almeida.jpg", linkedin: "https://www.linkedin.com/in/gabriel-almeida-115877410/" },
  { name: "Heitor Cavalcanti", group: "trainee", areas: ["eventos"], photo: "/equipe/heitor-cavalcanti.jpg", linkedin: "https://www.linkedin.com/in/heitorscavalcanti/" },
  { name: "Igor Dias", group: "trainee", areas: ["marketing"], photo: "/equipe/igor-dias.jpg", linkedin: "https://www.linkedin.com/in/igor-dias-7355773b3/" },
  { name: "João Gabriel", group: "trainee", areas: ["eventos"], photo: "/equipe/joao-gabriel.jpg", linkedin: "https://www.linkedin.com/in/jo%C3%A3o-gabriel-reis-silva-212707410/" },
  { name: "Leopoldo", group: "trainee", areas: ["marketing"], photo: "/equipe/leopoldo.jpg", linkedin: "https://www.linkedin.com/in/leopoldo-ortuzal-zuchieri-7a98a8410/" },
  { name: "Pedro Cione", group: "trainee", linkedin: "https://www.linkedin.com/in/pedrocione/" },
  { name: "Pedro Henrique", group: "trainee", areas: ["eventos"], photo: "/equipe/pedro-henrique.jpg", linkedin: "https://www.linkedin.com/in/pedrofpereira/" },
  { name: "Pedro Murakami", group: "trainee", areas: ["eventos"], photo: "/equipe/pedro-murakami.jpg", linkedin: "https://www.linkedin.com/in/pedro-vama-murakami/" },
  { name: "Pedru Paulo", group: "trainee", areas: ["eventos"], photo: "/equipe/pedru-paulo.jpg", linkedin: "https://www.linkedin.com/in/pedru-paulo-c-gama-02633b399/" },
  { name: "Rafael Infantini", group: "trainee", areas: ["eventos"], photo: "/equipe/rafael-infantini.jpg", linkedin: "https://www.linkedin.com/in/rbinfantini/" },
  { name: "Rafael Taffo", group: "trainee", areas: ["marketing"], photo: "/equipe/rafael-taffo.jpg", linkedin: "https://www.linkedin.com/in/rafael-taffo-montanha-5a11093bb/" },
  { name: "Victoria Tavares", group: "trainee", areas: ["pessoas"], photo: "/equipe/victoria-tavares.jpg", linkedin: "https://www.linkedin.com/in/victoria-tavares-877808411/" },
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
    if (member.group !== "membro" && member.viceOf) {
      errors.push(`${who}: viceOf só vale para group "membro".`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Erro em data/team.ts:\n- ${errors.join("\n- ")}`);
  }
}

validateTeam(members);

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
  fundadores:
    "Estudantes que idealizaram e fundaram a PUC Tech, estruturando sua base organizacional e seus primeiros projetos.",
  diretoriaExecutiva:
    "Responsável pela gestão geral da liga, composta por presidente e vice-presidente.",
  areasOperacionais:
    "Coordenações que garantem o funcionamento e a comunicação da liga: Pessoas, Eventos e Marketing.",
};