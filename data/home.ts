// Textos e números da home. Para destacar uma palavra em negrito, use **assim**.

export const hero = {
  title: "A Primeira Liga de Ciência e Tecnologia da PUC-SP",
};

export const about = {
  title: "Sobre",
  paragraphs: [
    "A **PUC Tech** é a primeira liga de ciência e tecnologia da PUC-SP, formada por estudantes que veem no protagonismo estudantil um motor de transformação. Criamos experiências práticas que unem teoria, tecnologia e impacto social.",
    "Atuamos com projetos, oficinas, eventos e iniciativas que desenvolvem competências técnicas, profissionais e humanas. Aqui, estudantes lideram, inovam e constroem soluções reais para desafios concretos, sempre em equipe.",
  ],
};

export const stats = [
  { value: 50, suffix: "+", label: "Estudantes já passaram pela liga" },
  { value: 10, suffix: "+", label: "Projetos desenvolvidos" },
  { value: 20, suffix: "+", label: "Eventos realizados" },
  { value: 5, suffix: "+", label: "Empresas parceiras" },
  { value: 15, suffix: "+", label: "Estudantes empregados" },
];

export const projectsIntro = {
  text: "Soluções aplicadas em IA, engenharia de software, cibersegurança e inovação social.",
  areas: [
    "Inteligência Artificial",
    "Engenharia de Software",
    "Cibersegurança",
    "Dados e Pesquisa Aplicada",
  ],
};

export const partnersIntro = {
  title: "Parceiros da PUC Tech",
  paragraphs: [
    "Acreditamos que inovação se faz em comunidade.",
    "Contamos com o apoio de empresas, organizações estudantis, startups e da própria universidade para ampliar nosso impacto.",
  ],
};

// Para mostrar o logo de um parceiro, coloque o arquivo em public/parceiros/
// e acrescente logo: "/parceiros/nome.png". Sem logo, aparece o nome em texto.
export const partners: { name: string; logo?: string; logoDark?: string; href?: string }[] = [
  { name: "PUC-SP", logo: "/parceiros/puc-sp.png", logoDark: "/parceiros/puc-sp-dark.png", href: "https://www.pucsp.br" },
  { name: "Amazon AWS", logo: "/parceiros/amazon-aws.svg", logoDark: "/parceiros/amazon-aws-dark.svg", href: "https://aws.amazon.com" },
  { name: "Blumi Talents", logo: "/parceiros/blumi-talents.png", logoDark: "/parceiros/blumi-talents-dark.png", href: "https://blumitalents.com" },
  { name: "Peacore", logo: "/parceiros/peacore.jpg", href: "https://peacore.com.br" },
  { name: "Conecta Devs", logo: "/parceiros/conecta-devs.jpg" },
  { name: "PUC Junior", logo: "/parceiros/puc-junior.png", logoDark: "/parceiros/puc-junior-dark.png", href: "https://pucjunior.com.br" },
  { name: "PUC Angels", logo: "/parceiros/puc-angels.webp", logoDark: "/parceiros/puc-angels-dark.webp", href: "https://pucangels.org" },
];

export const socialIntro = {
  title: "Acompanhe nossas redes sociais",
  tagline: "Não perca nenhuma novidade!",
  text: "Divulgamos projetos, eventos, mentorias e oportunidades de envolvimento pelas nossas redes sociais.",
};