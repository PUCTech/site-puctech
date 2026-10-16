import type { Metadata } from "next";
import Image from "next/image";
import { Block, SectionNav, SidebarLayout } from "@/components/Section";
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
    <Block id={id} title={title} subtitle={subtitle}>
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
    </Block>
  );
}

export default function EquipePage() {
  // Atalhos só para os grupos que têm gente (os vazios não aparecem).
  const nav = [
    { id: "tutores", label: "Tutores", show: advisors.length > 0 },
    { id: "honorarios", label: "Membros Honorários", show: honorary.length > 0 },
    { id: "fundadores", label: "Fundadores", show: founders.length > 0 },
    { id: "diretoria-executiva", label: "Diretoria Executiva", show: executive.length > 0 },
    { id: "diretorias-estrategicas", label: "Diretorias Estratégicas", show: strategic.length > 0 },
    { id: "areas-operacionais", label: "Áreas Operacionais", show: true },
    { id: "idealizadores", label: "Idealizadores", show: idealizers.length > 0 },
  ].filter((item) => item.show);

  return (
    <SidebarLayout
      title="Equipe"
      intro={
        <p>
          As pessoas que constroem a PUC Tech todos os dias, da orientação
          acadêmica aos estudantes que fazem a liga acontecer.
        </p>
      }
      aside={<SectionNav items={nav} />}
    >
      <div id="conheca-os-membros" className="scroll-mt-24 pb-12 md:pb-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[16/9]">
          <Image
            src="/equipe/grupo-puctech.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            priority
            className="object-cover"
          />
        </div>
        <p className="mt-8 max-w-[62ch] text-lg leading-relaxed md:text-xl">
          A PUC Tech é formada por uma comunidade de estudantes engajados,
          orientadores e parceiros que acreditam no protagonismo estudantil
          como motor da transformação na universidade e na sociedade.
        </p>
      </div>

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

      <Block
        id="areas-operacionais"
        title="Áreas Operacionais"
        subtitle={groupDescriptions.areasOperacionais}
      >
        <CurrentTeam />
      </Block>

      <MemberGroup
        id="idealizadores"
        title="Idealizadores"
        subtitle={groupDescriptions.idealizadores}
        members={idealizers}
      />
    </SidebarLayout>
  );
}
