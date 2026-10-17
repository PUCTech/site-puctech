import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Heading, Stage } from "@/components/Section";
import MemberCard, {
  featuredGrid,
  membersGrid,
} from "@/components/team/MemberCard";
import CurrentTeam from "@/components/team/CurrentTeam";
import OrgChart from "@/components/team/OrgChart";
import {
  advisors,
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

// Grupo pequeno, em meia largura: título menor e fotos menores.
function CompactGroup({
  title,
  subtitle,
  members,
  role,
}: {
  title: string;
  subtitle: string;
  members: Member[];
  role: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-[-0.02em] md:text-3xl">{title}</h2>
      <p className="mt-3 leading-relaxed text-pretty text-muted">{subtitle}</p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-8">
        {members.map((member) => (
          <div key={member.name} className="w-32">
            <MemberCard member={member} role={role} />
          </div>
        ))}
      </div>
    </div>
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

      {/* Tutores e fundadores lado a lado: grupos pequenos, em meia largura. */}
      <Stage id="tutores" className={gap}>
        <Reveal>
          <div className="grid gap-14 md:grid-cols-2 md:gap-16">
            <CompactGroup title="Tutores" subtitle={groupDescriptions.tutores} members={advisors} role="Tutor(a)" />
            <CompactGroup
              title="Fundadores"
              subtitle={groupDescriptions.fundadores}
              members={founders}
              role="Fundador(a)"
            />
          </div>
        </Reveal>
      </Stage>

      <MemberGroup
        id="honorarios"
        title="Membros Honorários"
        subtitle={groupDescriptions.honorarios}
        members={honorary}
        role="Membro honorário"
      />

      <Stage id="diretoria-executiva" className={gap}>
        <Heading title="Diretoria Executiva">
          <p>{groupDescriptions.diretoriaExecutiva}</p>
        </Heading>
        <Reveal delay={150}>
          <div className="mt-12">
            <OrgChart />
          </div>
        </Reveal>
      </Stage>

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
