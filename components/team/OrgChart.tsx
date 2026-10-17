import Image from "next/image";
import { areaInfo, executive, members, type AreaId, type Member } from "@/data/team";

// Cor de cada área: o retângulo pontilhado e o rótulo dele.
const areaColor: Record<AreaId, { border: string; text: string }> = {
  marketing: { border: "border-accent", text: "text-accent-ink" },
  eventos: { border: "border-amber-400", text: "text-amber-600 dark:text-amber-300" },
  pessoas: { border: "border-fuchsia-400", text: "text-fuchsia-600 dark:text-fuchsia-300" },
};

const areaIndex = (id: AreaId) => areaInfo.findIndex((area) => area.id === id);
const labelOf = (id: AreaId) => areaInfo[areaIndex(id)].label;

const areasOf = (m: Member): AreaId[] =>
  Array.from(new Set([...(m.areas ?? []), ...(m.presidentOf ?? []), ...(m.viceOf ?? [])])).sort(
    (a, b) => areaIndex(a) - areaIndex(b),
  );

const roleOf = (m: Member) => {
  const president = m.presidentOf?.[0];
  if (president) return `Coord. ${labelOf(president)}`;
  const vice = m.viceOf?.[0];
  if (vice) return `Vice-coord. ${labelOf(vice)}`;
  return "Membro";
};

// Ordem que deixa cada área num bloco contínuo: pela primeira área e depois pela
// última (Marketing, Eventos, Eventos + Pessoas, Pessoas). Coordenação primeiro.
// shortcut: só funciona enquanto ninguém estiver em duas áreas não vizinhas; se
// acontecer, o retângulo daquela área cobre quem está no meio.
const team = members
  .filter((m) => m.group === "membro")
  .map((m) => ({ m, areas: areasOf(m) }))
  .sort((a, b) => {
    const first = (x: AreaId[]) => (x.length ? areaIndex(x[0]) : 99);
    const last = (x: AreaId[]) => (x.length ? areaIndex(x[x.length - 1]) : 99);
    const leads = (m: Member) => (m.presidentOf ? 0 : m.viceOf ? 1 : 2);
    return (
      first(a.areas) - first(b.areas) ||
      last(a.areas) - last(b.areas) ||
      leads(a.m) - leads(b.m) ||
      a.m.name.localeCompare(b.m.name)
    );
  });

// Colunas (contando de 1) onde o retângulo de cada área começa e termina.
const spans = areaInfo.flatMap((area) => {
  const cols = team.flatMap(({ areas }, i) => (areas.includes(area.id) ? [i + 1] : []));
  return cols.length ? [{ id: area.id, start: cols[0], end: cols[cols.length - 1] + 1 }] : [];
});

function Photo({ member, className }: { member: Member; className: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-surface ${className}`}>
      {member.photo && <Image src={member.photo} alt="" fill sizes="80px" className="object-cover" />}
    </div>
  );
}

function Name({ member, className = "" }: { member: Member; className?: string }) {
  return member.linkedin ? (
    <a
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-semibold leading-tight underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current ${className}`}
    >
      {member.name}
    </a>
  ) : (
    <p className={`font-semibold leading-tight ${className}`}>{member.name}</p>
  );
}

/**
 * Organograma: diretoria executiva no topo, uma linha descendo e todo mundo num
 * grupo só. Retângulos pontilhados coloridos mostram de que área cada um é.
 */
export default function OrgChart() {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
        {executive.map((member) => (
          <div key={member.name} className="flex items-center gap-3">
            <Photo member={member} className="size-20" />
            <div>
              <Name member={member} className="text-lg" />
              <p className="mt-0.5 text-sm text-accent-ink">{member.cargo}</p>
            </div>
          </div>
        ))}
      </div>

      <span aria-hidden className="mx-auto mt-5 block h-12 w-px bg-accent/50" />

      {/* No celular o grupo rola na horizontal, para os retângulos continuarem certos. */}
      <div className="-mx-5 overflow-x-auto px-5 pt-3 pb-2 sm:mx-0 sm:px-0">
        <ul
          className="grid min-w-max sm:min-w-0"
          style={{ gridTemplateColumns: `repeat(${team.length}, minmax(4.75rem, 1fr))` }}
        >
          {spans.map((span) => (
            <li
              key={span.id}
              aria-hidden
              className={`relative row-start-1 rounded-2xl border-2 border-dashed ${areaColor[span.id].border}`}
              // Retângulos que se cruzam ficam um pouco mais para dentro, para os dois aparecerem.
              style={{ gridColumn: `${span.start} / ${span.end}`, margin: `${areaIndex(span.id) * 7}px 3px` }}
            >
              <span
                className={`absolute -top-2 left-3 bg-paper px-1.5 font-mono text-xs leading-none ${areaColor[span.id].text}`}
              >
                {labelOf(span.id)}
              </span>
            </li>
          ))}
          {team.map(({ m }, i) => (
            <li
              key={m.name}
              className="row-start-1 flex flex-col items-center px-1.5 pt-9 pb-7 text-center"
              style={{ gridColumn: i + 1 }}
            >
              <Photo member={m} className="size-14" />
              <Name member={m} className="mt-2.5 text-sm text-balance" />
              <p className={`mt-0.5 text-xs ${m.presidentOf || m.viceOf ? "text-accent-ink" : "text-muted"}`}>
                {roleOf(m)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Os retângulos são só visuais; aqui, quem é de cada área em texto. */}
      <ul className="sr-only">
        {areaInfo.map((area) => (
          <li key={area.id}>
            {area.label}:{" "}
            {team
              .filter(({ areas }) => areas.includes(area.id))
              .map(({ m }) => m.name)
              .join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
