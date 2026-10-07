import Image from "next/image";
import type { Member } from "@/data/team";

export const membersGrid =
  "grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,12.5rem)]";
export const featuredGrid =
  "grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(12rem,14rem))]";

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

  return (
    <article
      className={`relative flex flex-col items-center rounded-2xl border border-transparent px-3 py-4 text-center transition-colors hover:border-brand-500 ${
        highlight ? "bg-brand-200" : "bg-white"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-full ${
          highlight
            ? "h-24 w-24 bg-white ring-2 ring-white"
            : "h-20 w-20 bg-brand-200"
        }`}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Foto de ${member.name}`}
            fill
            sizes="96px"
            loading="eager"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={`flex h-full w-full items-center justify-center font-semibold text-brand-800 ${
              highlight ? "text-2xl" : "text-xl"
            }`}
          >
            {getInitials(member.name)}
          </span>
        )}
      </div>

      <h3
        className={`mt-3 font-semibold leading-tight text-brand-950 ${
          highlight ? "text-lg" : "text-base"
        }`}
      >
        {member.name}
      </h3>
      {role && <p className="mt-0.5 text-sm text-brand-800">{role}</p>}

      {badge && (
        <span
          className={`mt-3 rounded-full px-2.5 py-0.5 text-xs font-medium leading-snug text-brand-800 ${
            highlight ? "bg-white" : "bg-brand-200"
          }`}
        >
          {badge}
        </span>
      )}

      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${member.name} (abre em nova aba)`}
          className={`mt-3 text-sm underline decoration-transparent underline-offset-4 transition-colors after:absolute after:inset-0 after:rounded-2xl hover:decoration-current focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-500 ${
            highlight ? "text-brand-800" : "text-brand-500"
          }`}
        >
          LinkedIn ↗
        </a>
      )}
    </article>
  );
}