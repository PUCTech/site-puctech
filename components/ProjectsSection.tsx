import Section from "@/components/Section";
import { projectsIntro } from "@/data/home";

export default function ProjectsSection() {
  return (
    <Section id="projetos" title="Projetos">
      <p className="max-w-2xl text-lg text-brand-200/90">
        {projectsIntro.text}
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {projectsIntro.areas.map((area) => (
          <li
            key={area}
            className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-brand-950"
          >
            {area}
          </li>
        ))}
      </ul>
    </Section>
  );
}