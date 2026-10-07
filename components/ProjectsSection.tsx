import Link from "next/link";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Section from "@/components/Section";
import { projectsIntro } from "@/data/home";
import { projects } from "@/data/projects";

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

      {projects.length > 0 && (
        <div className="mt-12">
          <ProjectsShowcase projects={projects} />
        </div>
      )}

      <Link
        href="/projetos"
        className="mt-10 inline-block rounded-full border border-brand-500 px-6 py-3 font-medium transition-colors hover:border-brand-200 hover:text-brand-200"
      >
        Conheça nossos projetos
      </Link>
    </Section>
  );
}