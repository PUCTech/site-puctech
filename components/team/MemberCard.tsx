import Image from "next/image";
import type { Member } from "@/data/team";

export const membersGrid =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5";

export const featuredGrid = "grid grid-cols-2 gap-3 md:grid-cols-3";

type MemberCardProps = {
  member: Member;
  role?: string; // texto abaixo do nome (ex.: "Membro", "Presidente")
  variant?: "default" | "highlight";
  badge?: string;
};

const TITLES = ["prof.", "profa."];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((part) => part && !TITLES.includes(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function MemberCard({
  member,
  role,
  variant = "default",
  badge,
}: MemberCardProps) {
  const highlight = variant === "highlight";
  const title = member.cargo ?? role;

  return (
    <article
      className={`group relative rounded-3xl p-2 pb-4 transition-colors ${
        highlight ? "bg-accent" : "bg-surface hover:bg-[#e3f0f5]"
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-white">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Foto de ${member.name}`}
            fill
            sizes={highlight ? "(min-width: 768px) 260px, 50vw" : "(min-width: 768px) 180px, 50vw"}
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-full items-center justify-center font-display text-3xl font-bold text-accent-ink"
          >
            {getInitials(member.name)}
          </span>
        )}
      </div>

      <div className="px-2 pt-3">
        <h3 className={`font-display leading-tight font-bold ${highlight ? "text-lg" : ""}`}>
          {member.name}
        </h3>
        {title && (
          <p className={`mt-0.5 text-sm ${highlight ? "text-ink" : "text-muted"}`}>
            {title}
          </p>
        )}

        {badge && (
          <p className="mt-2 inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-medium">
            {badge}
          </p>
        )}

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn de ${member.name} (abre em nova aba)`}
            className="mt-2 block text-sm font-semibold underline decoration-transparent underline-offset-4 transition-colors after:absolute after:inset-0 after:rounded-3xl hover:decoration-current focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent-ink"
          >
            LinkedIn ↗
          </a>
        )}
      </div>
    </article>
  );
}
