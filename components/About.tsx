import Section from "@/components/Section";
import { about } from "@/data/home";

export default function About() {
  return (
    <Section id="sobre" eyebrow="Sobre" title={about.title} tone="alt">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-brand-200/90">
        {about.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </Section>
  );
}