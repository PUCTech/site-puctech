import Image from "next/image";
import { areaInfo, executive, members, type AreaId, type Member } from "@/data/team";

// Pessoa no organograma: foto redonda e nome ao lado, sem caixa.
function Node({ member, role, size = "sm" }: { member: Member; role: string; size?: "sm" | "lg" }) {
  const photo = size === "lg" ? "size-20" : "size-12";
  return (
    <div className="flex items-center gap-3 text-left">
      <div className={`relative shrink-0 overflow-hidden rounded-full bg-surface ${photo}`}>
        {member.photo && (
          <Image src={member.photo} alt="" fill sizes="80px" className="object-cover" />
        )}
      </div>
      <div>
        {member.linkedin ? (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold leading-tight underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current ${size === "lg" ? "text-lg" : ""}`}
          >
            {member.name}
          </a>
        ) : (
          <p className="font-semibold leading-tight">{member.name}</p>
        )}
        <p className="mt-0.5 text-sm text-accent-ink">{role}</p>
      </div>
    </div>
  );
}

const leadersOf = (area: AreaId) => [
  ...members.filter((m) => m.presidentOf?.includes(area)).map((m) => ({ m, role: "Coordenador(a)" })),
  ...members.filter((m) => m.viceOf?.includes(area)).map((m) => ({ m, role: "Vice-coordenador(a)" })),
];

/**
 * Organograma como no Teams: diretoria executiva no topo e uma linha que desce
 * e se divide para cada área, com quem a coordena.
 */
export default function OrgChart() {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
        {executive.map((member) => (
          <Node key={member.name} member={member} role={member.cargo ?? ""} size="lg" />
        ))}
      </div>

      <span aria-hidden className="mx-auto mt-5 hidden h-10 w-px bg-accent/50 sm:block" />

      <ul className="mt-8 grid gap-10 sm:mt-0 sm:grid-cols-3 sm:gap-0">
        {areaInfo.map((area, i) => {
          const leaders = leadersOf(area.id);
          return (
            <li key={area.id} className="relative flex flex-col items-center sm:px-4">
              {/* Linha horizontal que liga as áreas, mais o tracinho que desce para cada uma. */}
              <span
                aria-hidden
                className={`absolute top-0 hidden h-px bg-accent/50 sm:block ${
                  i === 0 ? "right-0 left-1/2" : i === areaInfo.length - 1 ? "right-1/2 left-0" : "inset-x-0"
                }`}
              />
              <span aria-hidden className="hidden h-10 w-px bg-accent/50 sm:block" />
              <p className="font-mono text-sm text-accent-ink sm:mt-4">{area.label}</p>
              <div className="mt-4 space-y-4">
                {leaders.length > 0 ? (
                  leaders.map(({ m, role }) => <Node key={m.name} member={m} role={role} />)
                ) : (
                  <p className="text-sm text-muted">Coordenação a definir</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
