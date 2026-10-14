import type { Metadata } from "next";
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
    "Conheça os orientadores, fundadores e a equipe atual da PucTech, Liga Acadêmica de Tecnologia da PUC-SP.",
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
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,#143966_0%,transparent_100%)] opacity-70"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Nossa equipe
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-200/90">
            As pessoas que constroem a PucTech todos os dias, da orientação
            acadêmica aos estudantes que fazem a liga acontecer.
          </p>
        </div>
      </section>

      <MemberGroup id="tutores" title="Tutores" subtitle={groupDescriptions.tutores} members={advisors} role="Tutor(a)" />
      <MemberGroup id="honorarios" title="Membros Honorários" subtitle={groupDescriptions.honorarios} members={honorary} role="Membro honorário" />
      <MemberGroup id="fundadores" title="Fundadores" subtitle={groupDescriptions.fundadores} members={founders} role="Fundador(a)" />
      <MemberGroup id="diretoria-executiva" title="Diretoria Executiva" subtitle={groupDescriptions.diretoriaExecutiva} members={executive} highlight />
      <MemberGroup id="diretorias-estrategicas" title="Diretorias Estratégicas" subtitle={groupDescriptions.diretoriasEstrategicas} members={strategic} highlight />

      <Section
        id="areas-operacionais"
        title="Áreas Operacionais"
        subtitle={groupDescriptions.areasOperacionais}
      >
        <CurrentTeam />
      </Section>

      <MemberGroup id="idealizadores" title="Idealizadores" subtitle={groupDescriptions.idealizadores} members={idealizers} />
    </main>
  );
}