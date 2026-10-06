import Image from "next/image";
import Section from "@/components/Section";
import { about } from "@/data/home";

export default function About() {
  return (
    <Section id="sobre" eyebrow="Sobre" title={about.title}>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed text-brand-200/90">
          {about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo da PucTech"
              width={240}
              height={240}
              className="rounded-3xl"
            />
          </div>
      </div>
    </Section>
  );
}