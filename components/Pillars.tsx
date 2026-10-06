import Section from "@/components/Section";
import { pillars } from "@/data/home";

export default function Pillars() {
  return (
    <Section eyebrow="O que fazemos" title="Nossos pilares">
      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className="rounded-2xl border border-brand-800 bg-linear-to-b from-brand-900 to-brand-950 p-8"
          >
            <p className="text-sm font-semibold text-brand-500">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-xl font-semibold">{pillar.title}</h3>
            <p className="mt-3 text-brand-200/80">{pillar.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}