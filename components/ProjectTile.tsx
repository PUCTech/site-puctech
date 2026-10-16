import Image from "next/image";
import { projectStatuses, type Project } from "@/data/projects";

export default function ProjectTile({ project }: { project: Project }) {
  const status = projectStatuses.find((item) => item.id === project.status)?.label;

  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#04142f]">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold tracking-[-0.03em] text-accent"
          >
            {project.title}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <p className="font-display text-2xl font-bold tracking-[-0.02em] underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-accent">
          {project.title}
        </p>
        {project.summary && (
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{project.summary}</p>
        )}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {[project.area, status].filter(Boolean).map((item) => (
            <span key={item} className="rounded-full bg-surface px-3 py-1 text-xs font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
