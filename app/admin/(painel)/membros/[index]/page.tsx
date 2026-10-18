import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteMember, saveMember } from "@/app/admin/actions";
import { AdminForm, DeleteForm, Field } from "@/components/admin/forms";
import { input } from "@/components/admin/styles";
import { areaInfo, groups, type AreaId } from "@/data/team";
import { loadMembers } from "@/lib/admin-data";

function AreaChecks({ name, label, hint, checked }: { name: string; label: string; hint: string; checked?: AreaId[] }) {
  return (
    <fieldset>
      <legend className="font-mono text-sm text-muted">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {areaInfo.map((area) => (
          <label key={area.id} className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" name={name} value={area.id} defaultChecked={checked?.includes(area.id)} />
            {area.label}
          </label>
        ))}
      </div>
      <p className="mt-1.5 text-sm text-muted">{hint}</p>
    </fieldset>
  );
}

export default async function EditMember({ params }: { params: Promise<{ index: string }> }) {
  const { index } = await params;
  const isNew = index === "novo";
  const { members, sha } = await loadMembers();
  const member = isNew ? undefined : members[Number(index)];
  if (!isNew && (!/^\d+$/.test(index) || !member)) notFound();

  return (
    <>
      <Link href="/admin/membros" className="font-mono text-sm text-accent-ink underline underline-offset-4 hover:text-ink">
        ← membros
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-[-0.03em] md:text-5xl">{member ? member.name : "Nova pessoa"}</h1>

      <AdminForm action={saveMember} submit={isNew ? "Adicionar" : "Salvar"} className="mt-12 max-w-3xl">
        <input type="hidden" name="index" value={isNew ? "" : index} />
        <input type="hidden" name="sha" value={sha} />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="nome">
            <input name="name" required defaultValue={member?.name} className={input} />
          </Field>
          <Field label="grupo">
            <select name="group" required defaultValue={member?.group ?? "membro"} className={input}>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="cargo" hint="Opcional. Texto abaixo do nome (ex.: Tutora, Diretor de Ensino).">
            <input name="cargo" defaultValue={member?.cargo} className={input} />
          </Field>
          <Field label="linkedin" hint="Ou outro link (Lattes, site).">
            <input name="linkedin" type="url" defaultValue={member?.linkedin} placeholder="https://www.linkedin.com/in/…" className={input} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="foto" hint="JPG, PNG ou WebP, até 4 MB. De preferência quadrada, com o rosto no centro.">
              <div className="flex flex-wrap items-center gap-5">
                {member?.photo && (
                  <Image src={member.photo} alt="" width={64} height={64} className="size-16 rounded-full object-cover" />
                )}
                <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
              </div>
            </Field>
            {member?.photo && (
              <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" name="removePhoto" /> remover foto
              </label>
            )}
          </div>

          <div className="space-y-6 sm:col-span-2">
            <AreaChecks name="areas" label="áreas" hint="Só para Membro e Trainee." checked={member?.areas} />
            <AreaChecks name="presidentOf" label="coordena" hint="Só para Membro." checked={member?.presidentOf} />
            <AreaChecks name="viceOf" label="vice-coordena" hint="Só para Membro." checked={member?.viceOf} />
          </div>
        </div>
      </AdminForm>

      {member && (
        <div className="mt-16 border-t border-border pt-8">
          <DeleteForm action={deleteMember} what={member.name}>
            <input type="hidden" name="index" value={index} />
            <input type="hidden" name="sha" value={sha} />
          </DeleteForm>
        </div>
      )}
    </>
  );
}
