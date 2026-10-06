import type { Metadata } from "next";
import Section from "@/components/Section";
import MemberCard from "@/components/team/MemberCard";
import CurrentTeam from "@/components/team/CurrentTeam";
import { advisors, founders } from "@/data/team";

export const metadata: Metadata = {
  title: "Equipe",
  description:
    "Conheça os orientadores, fundadores e a equipe atual da PucTech, Liga Academia de Tecnologia da PUC-SP.",
};

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

      <Section eyebrow="Orientação" title="Orientadores">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advisors.map((member, index) => (
            <MemberCard key={index} member={member} role="Orientador(a)" />
          ))}
        </div>
      </Section>

      <Section eyebrow="História" title="Fundadores">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((member, index) => (
            <MemberCard key={index} member={member} role="Fundador(a)" />
          ))}
        </div>
      </Section>

      <Section eyebrow="Hoje" title="Equipe atual">
        <CurrentTeam />
      </Section>
    </main>
  );
}