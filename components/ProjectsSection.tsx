import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { projectsIntro } from "@/data/home";
import { projectAreas } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <Section id="projetos" title="Projetos">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="max-w-xl text-lg text-brand-200/90">
            {projectsIntro.text}
          </p>
          <Link
            href="/projetos"
            className="mt-8 inline-block rounded-full border border-brand-500 px-6 py-3 font-medium transition-colors hover:border-brand-200 hover:text-brand-200"
          >
            Conheça nossos projetos
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {projectAreas.map((area) => (
            <li
              key={area.title}
              className="relative flex h-32 items-end overflow-hidden rounded-2xl bg-brand-900 p-4 sm:h-36"
            >
              <Image
                src={area.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 260px, 50vw"
                className="object-cover"
                style={{ objectPosition: area.position }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-brand-950 via-brand-950/50 to-transparent"
              />
              <p className="relative text-sm font-semibold text-white sm:text-base">
                {area.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}