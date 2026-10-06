import Image from "next/image";
import type { Member } from "@/data/team";

type MemberCardProps = {
  member: Member;
  role?: string; // texto abaixo do nome (ex.: "Membro", "Presidente")
  variant?: "default" | "highlight";
  badge?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
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
      className={`relative flex flex-col items-center rounded-2xl border p-6 text-center transition-colors ${
        highlight
          ? "border-brand-500 bg-linear-to-b from-brand-800 to-brand-900 shadow-lg shadow-brand-500/10"
          : "border-brand-800 bg-brand-900/50 hover:border-brand-500"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-full bg-brand-800 ${
          highlight ? "h-32 w-32 ring-2 ring-brand-200" : "h-24 w-24"
        }`}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Foto de ${member.name}`}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={`flex h-full w-full items-center justify-center font-semibold text-brand-200 ${
              highlight ? "text-3xl" : "text-2xl"
            }`}
          >
            {getInitials(member.name)}
          </span>
        )}
      </div>

      <h3 className={`mt-4 font-semibold ${highlight ? "text-xl" : "text-lg"}`}>
        {member.name}
      </h3>
      {role && <p className="mt-1 text-sm text-brand-200/80">{role}</p>}

      {badge && (
        <span
          className={`mt-4 rounded-full px-3 py-1 text-xs font-medium ${
            highlight
              ? "bg-brand-200 text-brand-950"
              : "border border-brand-800 text-brand-200"
          }`}
        >
          {badge}
        </span>
      )}

      {member.linkedin && (
        // O after:absolute faz o link cobrir o cartão inteiro (clique em qualquer lugar).
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${member.name} (abre em nova aba)`}
          className="mt-4 text-sm text-brand-200/80 underline decoration-transparent underline-offset-4 transition-colors after:absolute after:inset-0 after:rounded-2xl hover:text-white hover:decoration-brand-200 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-200"
        >
          LinkedIn ↗
        </a>
      )}
    </article>
  );
}