import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectTile({ project }: { project: Project }) {
  return (
    <div className="relative size-full bg-linear-to-br from-brand-800 to-brand-900 text-left">
      {project.image && (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-950/90 via-brand-950/50 to-transparent px-3 pb-3 pt-10">
        <p className="line-clamp-2 text-sm font-semibold text-white">
          {project.title}
        </p>
      </div>
    </div>
  );
}