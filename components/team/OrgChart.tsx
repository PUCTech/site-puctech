import Image from "next/image";
import { areaColor, areaIndex, areasOf, labelOf } from "@/components/team/areas";
import { areaInfo, cargoIn, teamPage, type AreaId, type Member } from "@/data/team";
import type { Lang } from "@/lib/i18n";

const roleOf = (m: Member, lang: Lang) => {
  const roles = teamPage[lang].roles;
  const president = m.presidentOf?.[0];
  if (president) return roles.leadOf.replace("{area}", labelOf(president, lang));
  const vice = m.viceOf?.[0];
  if (vice) return roles.viceOf.replace("{area}", labelOf(vice, lang));
  return roles.member;
};

// Ordem que deixa cada área num bloco contínuo: pela primeira área e depois pela
// última (Marketing, Eventos, Eventos + Pessoas, Pessoas). Coordenação primeiro.
// shortcut: só funciona enquanto ninguém estiver em duas áreas não vizinhas; se
// acontecer, o retângulo daquela área cobre quem está no meio.
const teamOf = (members: Member[]) =>
  members
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
const spansOf = (team: ReturnType<typeof teamOf>) =>
  areaInfo.flatMap((area) => {
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
export default function OrgChart({ lang, members }: { lang: Lang; members: Member[] }) {
  const executive = members.filter((m) => m.group === "presidente" || m.group === "vice-presidente");
  const team = teamOf(members);
  const spans = spansOf(team);
  return (
    <div>
      {/* Presidente e vice ligados por uma linha; dela desce a linha para o grupo. */}
      <div className="flex flex-wrap items-center justify-center gap-y-6">
        {executive.map((member, i) => (
          <div key={member.name} className="flex items-center">
            {i > 0 && <span aria-hidden className="mx-5 hidden h-px w-16 bg-accent/50 sm:block" />}
            <div className="flex items-center gap-3">
              <Photo member={member} className="size-20" />
              <div>
                <Name member={member} className="text-lg" />
                <p className="mt-0.5 text-sm text-accent-ink">{cargoIn(member.cargo, lang)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div aria-hidden className="flex flex-col items-center">
        <span className="mt-5 h-12 w-px bg-accent/50" />
        <span className="size-1.5 rounded-full bg-accent" />
      </div>

      {/* No celular o grupo rola na horizontal, para os retângulos continuarem certos. */}
      <div className="-mx-5 overflow-x-auto px-5 pt-3 pb-2 sm:mx-0 sm:px-0">
        <ul
          className="org grid min-w-max sm:min-w-0"
          style={{ gridTemplateColumns: `repeat(${team.length}, minmax(4.75rem, 1fr))` }}
        >
          {spans.map((span) => (
            <li
              key={span.id}
              aria-hidden
              className={`org-area-${span.id} relative row-start-1 rounded-2xl border-2 border-dashed ${areaColor[span.id].border}`}
              // Retângulos que se cruzam ficam um pouco mais para dentro, para os dois aparecerem.
              style={{ gridColumn: `${span.start} / ${span.end}`, margin: `${areaIndex(span.id) * 7}px 3px` }}
            >
              <span
                className={`absolute -top-2.5 left-3 z-10 cursor-default bg-paper px-1.5 py-0.5 font-mono text-xs leading-none ${areaColor[span.id].text}`}
              >
                {labelOf(span.id, lang)}
              </span>
            </li>
          ))}
          {team.map(({ m, areas }, i) => (
            <li
              key={m.name}
              data-areas={areas.join(" ")}
              className="org-member row-start-1 flex flex-col items-center px-1.5 pt-9 pb-7 text-center transition-opacity duration-300"
              style={{ gridColumn: i + 1 }}
            >
              <Photo
                member={m}
                className={`size-14 ${m.presidentOf || m.viceOf ? "ring-2 ring-accent ring-offset-2 ring-offset-paper" : ""}`}
              />
              <Name member={m} className="mt-2.5 text-sm text-balance" />
              <p className={`mt-0.5 text-xs ${m.presidentOf || m.viceOf ? "text-accent-ink" : "text-muted"}`}>
                {roleOf(m, lang)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Os retângulos são só visuais; aqui, quem é de cada área em texto. */}
      <ul className="sr-only">
        {areaInfo.map((area) => (
          <li key={area.id}>
            {area.name[lang]}:{" "}
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
