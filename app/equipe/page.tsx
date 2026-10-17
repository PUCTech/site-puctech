import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Heading, Stage } from "@/components/Section";
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

// Mesmo ritmo da home e do /sobre.
const gap = "py-12 md:py-16";

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
    <Stage id={id} className={gap}>
      <Heading title={title}>
        <p>{subtitle}</p>
      </Heading>
      <Reveal delay={150}>
        <div className={`mt-10 ${highlight ? featuredGrid : membersGrid}`}>
          {members.map((member) => (
            <MemberCard
              key={member.name}
              member={member}
              role={role}
              variant={highlight ? "highlight" : "default"}
            />
          ))}
        </div>
      </Reveal>
    </Stage>
  );
}

export default function EquipePage() {
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <h1 className="fade-in text-5xl font-bold tracking-[-0.04em] md:text-7xl">Equipe</h1>
        <p className="fade-in mt-6 max-w-3xl text-xl leading-relaxed text-pretty text-muted [animation-delay:250ms] md:text-2xl">
          As pessoas que constroem a PUC Tech todos os dias, da orientação acadêmica aos
          estudantes que fazem a liga acontecer.
        </p>
      </Stage>

      <Stage id="conheca-os-membros">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[21/9]">
            <Image
              src="/equipe/grupo-puctech.jpg"
              alt="Membros da PUC Tech reunidos"
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              priority
              className="object-cover"
            />
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-pretty text-muted">
            A PUC Tech é formada por uma comunidade de estudantes engajados, orientadores e
            parceiros que acreditam no protagonismo estudantil como motor da transformação na
            universidade e na sociedade.
          </p>
        </Reveal>
      </Stage>

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

      <Stage id="areas-operacionais" className={gap}>
        <Heading title="Áreas Operacionais">
          <p>{groupDescriptions.areasOperacionais}</p>
        </Heading>
        <Reveal delay={150}>
          <div className="mt-10">
            <CurrentTeam />
          </div>
        </Reveal>
      </Stage>

      <MemberGroup
        id="idealizadores"
        title="Idealizadores"
        subtitle={groupDescriptions.idealizadores}
        members={idealizers}
      />

      <div className="pb-12 md:pb-16" />
    </main>
  );
}
