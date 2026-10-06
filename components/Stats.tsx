import Section from "@/components/Section";
import { stats } from "@/data/home";

export default function Stats() {
  return (
    <Section eyebrow="Números" title="A PucTech em números">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-brand-800 bg-brand-900/50 p-6 text-center"
          >
            <p className="text-4xl font-bold text-brand-200">{stat.value}</p>
            <p className="mt-2 text-sm text-brand-200/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}