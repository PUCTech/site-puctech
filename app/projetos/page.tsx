import type { Metadata } from "next";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Reveal from "@/components/Reveal";
import { Stage } from "@/components/Section";
import { projectsPage } from "@/data/projects";
import { getProjects } from "@/lib/content";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = projectsPage[lang];
  return { title: t.title, description: t.description };
}

export default async function ProjetosPage() {
  const lang = await getLang();
  const t = projectsPage[lang];
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <h1 className="fade-in text-4xl font-bold tracking-[-0.04em] md:text-6xl">{t.title}</h1>
        <p className="fade-in mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-muted [animation-delay:250ms] md:text-xl">
          {t.intro}
        </p>
      </Stage>

      <Stage id="lista" className="pt-4 pb-20 md:pb-28">
        <Reveal delay={150}>
          <ProjectsShowcase projects={await getProjects(lang)} lang={lang} />
        </Reveal>
      </Stage>
    </main>
  );
}
