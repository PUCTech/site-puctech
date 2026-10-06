// ATENÇÃO: todos os nomes abaixo são EXEMPLO. Substitua pelos dados reais da PucTech.
// Para usar foto: coloque o arquivo em public/equipe/ e use photo: "/equipe/nome.jpg".

export type Member = {
  name: string;
  role: string;
  photo?: string;
  linkedin?: string;
};

export type AreaId = "marketing" | "eventos" | "pessoas";

export type Area = {
  id: AreaId;
  label: string;
  description: string;
  presidents: Member[];
  members: Member[];
};

export const advisors: Member[] = [
  { name: "Exemplo", role: "Professora orientadora" },
  { name: "Exemplo", role: "Professor orientador" },
];

export const founders: Member[] = [
  { name: "Exemplo", role: "Fundadora" },
  { name: "Exemplo", role: "Fundador" },
  { name: "Exemplo", role: "Fundadora" },
];

export const areas: Area[] = [
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Cuida da comunicação, das redes sociais e da identidade visual da liga.",
    presidents: [
      { name: "Exemplo", role: "Presidente" },
      { name: "Exemplo", role: "Presidente" },
    ],
    members: [
      { name: "Exemplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
    ],
  },
  {
    id: "eventos",
    label: "Eventos",
    description:
      "Organiza palestras, workshops e encontros com empresas e profissionais.",
    presidents: [{ name: "Exemplo", role: "Presidente" }],
    members: [
      { name: "Exmplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
    ],
  },
  {
    id: "pessoas",
    label: "Pessoas",
    description:
      "Cuida da integração dos membros, da cultura e dos processos seletivos.",
    presidents: [
      { name: "Exemplo", role: "Presidente" },
      { name: "Exemplo", role: "Presidente" },
    ],
    members: [
      { name: "Exemplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
      { name: "Exemplo", role: "Membro" },
    ],
  },
];