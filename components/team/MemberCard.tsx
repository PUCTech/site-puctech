import Image from "next/image";
import type { ReactNode } from "react";
import { LinkedinIcon } from "@/components/SocialIcons";
import { cargoIn, teamPage, type Member } from "@/data/team";
import { ui } from "@/data/ui";
import type { Lang } from "@/lib/i18n";

export const membersGrid =
  "grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

export const featuredGrid = "grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-4";

type MemberCardProps = {
  member: Member;
  lang: Lang;
  role?: string; // texto abaixo do nome (ex.: "Membro", "Presidente")
  variant?: "default" | "highlight";
  badge?: ReactNode;
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
  lang,
  role,
  variant = "default",
  badge,
}: MemberCardProps) {
  const highlight = variant === "highlight";
  const title = cargoIn(member.cargo, lang) ?? role;

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`${teamPage[lang].photoOf} ${member.name}`}
            fill
            sizes={highlight ? "(min-width: 768px) 260px, 50vw" : "(min-width: 768px) 200px, 50vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-full items-center justify-center font-mono text-2xl text-accent-ink"
          >
            {getInitials(member.name)}
          </span>
        )}
        {member.linkedin && (
          // No hover, sobe uma faixa escura com o "linkedin ↗" em mono, no tom de terminal.
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 flex translate-y-full items-end bg-gradient-to-t from-black/75 to-transparent px-3 pt-10 pb-3 font-mono text-xs text-white transition-transform duration-300 ease-out group-hover:translate-y-0"
          >
            linkedin ↗
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className={`leading-tight font-semibold text-balance ${highlight ? "text-lg" : ""}`}>
            {member.linkedin ? (
              // O card inteiro é o link (pelo ::after), o nome é só o texto dele.
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name}, LinkedIn (${ui[lang].newTab})`}
                className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent-ink"
              >
                {member.name}
              </a>
            ) : (
              member.name
            )}
          </h3>
          {title && (
            <p className={`mt-1 text-sm ${highlight ? "font-medium text-accent-ink" : "text-muted"}`}>{title}</p>
          )}
          {badge && <div className="mt-1.5 font-mono text-xs">{badge}</div>}
        </div>
        {member.linkedin && (
          <LinkedinIcon className="mt-0.5 size-4 shrink-0 text-muted transition-colors group-hover:text-accent-ink" />
        )}
      </div>
    </article>
  );
}
