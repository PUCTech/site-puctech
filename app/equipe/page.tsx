import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import MemberCard, {
  featuredGrid,
  membersGrid,
} from "@/components/team/MemberCard";
import CurrentTeam from "@/components/team/CurrentTeam";
import {
  advisors,
  executive,
  founders,
  groupDescriptions,
  honorary,
  idealizers,
  strategic,
  type Member,
} from "@/data/team";

export const metadata: Metadata = {
  title: "Equipe",
  description:
    "Conheça os tutores, fundadores e a equipe atual da PUC Tech, a primeira liga de ciência e tecnologia da PUC-SP.",
};

// Grupo de pessoas. Se estiver vazio, a seção não aparece.
function MemberGroup({
  id,
  title,
  subtitle,
  members,
  role,
  highlight = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  members: Member[];
  role?: string;
  highlight?: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <Section id={id} title={title} subtitle={subtitle}>
      <div className={highlight ? featuredGrid : membersGrid}>
        {members.map((member) => (
          <MemberCard
            key={member.name}
            member={member}
            role={role}
            variant={highlight ? "highlight" : "default"}
          />
        ))}
      </div>
    </Section>
  );
}

export default function EquipePage() {
  return (
    <main>
      <section className="overflow-hidden">
        {/* A largura máxima (62rem) mantém a proporção 7:5 e centraliza a foto em telas grandes. */}
        <div className="hero-fade-x relative mx-auto h-[38rem] max-w-[62rem] md:h-[36rem] lg:aspect-[8/5] lg:h-auto">
          <Image
            src="/equipe/grupo-puctech.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 992px, 100vw"
            loading="eager"
            className="object-cover object-top"
          />
          {/* Camadas escuras: deixam o texto legível e fundem a foto com o resto da página. */}
          <div aria-hidden className="absolute inset-0 bg-brand-950/70" />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-b from-transparent from-75% to-brand-950"
          />
          {/* Texto colado no topo, para ficar acima das cabeças da foto. */}
          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-12 text-center md:pt-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Equipe
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-brand-200/90 sm:text-lg md:mt-6">
              As pessoas que constroem a PUC Tech todos os dias, da orientação
              acadêmica aos estudantes que fazem a liga acontecer.
            </p>
          </div>
        </div>
      </section>

      {/* Só padding em cima: o espaço de baixo vem da seção seguinte (Tutores). */}
      <section id="conheca-os-membros" className="scroll-mt-16 pt-16 md:pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="max-w-3xl text-lg text-brand-200/90">
            A PUC Tech é formada por uma comunidade de estudantes engajados,
            orientadores e parceiros que acreditam no protagonismo estudantil
            como motor da transformação na universidade e na sociedade.
          </p>
        </div>
      </section>

      <MemberGroup
        id="tutores"
        title="Tutores"
        subtitle={groupDescriptions.tutores}
        members={advisors}
        role="Tutor(a)"
      />

      <MemberGroup
        id="honorarios"
        title="Membros Honorários"
        subtitle={groupDescriptions.honorarios}
        members={honorary}
        role="Membro honorário"
      />

      <MemberGroup
        id="fundadores"
        title="Fundadores"
        subtitle={groupDescriptions.fundadores}
        members={founders}
        role="Fundador(a)"
      />

      <MemberGroup
        id="diretoria-executiva"
        title="Diretoria Executiva"
        subtitle={groupDescriptions.diretoriaExecutiva}
        members={executive}
        highlight
      />

      <MemberGroup
        id="diretorias-estrategicas"
        title="Diretorias Estratégicas"
        subtitle={groupDescriptions.diretoriasEstrategicas}
        members={strategic}
        highlight
      />

      <Section
        id="areas-operacionais"
        title="Áreas Operacionais"
        subtitle={groupDescriptions.areasOperacionais}
      >
        <CurrentTeam />
      </Section>

      <MemberGroup
        id="idealizadores"
        title="Idealizadores"
        subtitle={groupDescriptions.idealizadores}
        members={idealizers}
      />
    </main>
  );
}