import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteMember, saveMember } from "@/app/admin/actions";
import { AdminForm, DeleteForm, Field } from "@/components/admin/forms";
import { ImageInput } from "@/components/admin/ImageInput";
import { input } from "@/components/admin/styles";
import { areaInfo, groups, type AreaId } from "@/data/team";
import { loadMember, versionOf } from "@/lib/admin-data";

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

export default async function EditMember({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "novo";
  const member = isNew ? undefined : await loadMember(id);
  if (!isNew && !member) notFound();
  const version = member ? versionOf(member) : "";

  return (
    <>
      <Link href="/admin/membros" className="font-mono text-sm text-accent-ink underline underline-offset-4 hover:text-ink">
        ← membros
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-[-0.03em] md:text-5xl">{member ? member.name : "Nova pessoa"}</h1>

      <AdminForm action={saveMember} submit={isNew ? "Adicionar" : "Salvar"} className="mt-12 max-w-3xl">
        <input type="hidden" name="id" value={member?.id ?? ""} />
        <input type="hidden" name="version" value={version} />

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
            <input name="cargo" defaultValue={member?.cargo ?? undefined} className={input} />
          </Field>
          <Field label="linkedin" hint="Ou outro link (Lattes, site).">
            <input name="linkedin" type="url" defaultValue={member?.linkedin ?? undefined} placeholder="https://www.linkedin.com/in/…" className={input} />
          </Field>
          <Field label="ordem" hint="Menor aparece primeiro dentro do grupo. Vazio: vai para o fim.">
            <input name="position" type="number" step={1} defaultValue={member?.position} className={input} />
          </Field>

          <div className="sm:col-span-2">
            <span className="font-mono text-sm text-muted">foto</span>
            <div className="mt-2">
              <ImageInput name="photo" removeName="removePhoto" current={member?.photo ?? undefined} shape="round" />
            </div>
          </div>

          <label className="flex items-start gap-3 sm:col-span-2">
            <input type="checkbox" name="inactive" defaultChecked={member?.inactive} className="mt-1" />
            <span>
              <span className="block font-semibold">Já saiu da liga</span>
              <span className="block text-sm text-muted">
                Some das listas do site, mas continua com foto e LinkedIn nos projetos em que participou.
              </span>
            </span>
          </label>

          <div className="space-y-6 sm:col-span-2">
            <AreaChecks name="areas" label="áreas" hint="Só para Membro e Trainee." checked={member?.areas ?? undefined} />
            <AreaChecks name="presidentOf" label="coordena" hint="Só para Membro." checked={member?.president_of ?? undefined} />
            <AreaChecks name="viceOf" label="vice-coordena" hint="Só para Membro." checked={member?.vice_of ?? undefined} />
          </div>
        </div>
      </AdminForm>

      {member && (
        <div className="mt-16 border-t border-border pt-8">
          <DeleteForm action={deleteMember} what={member.name}>
            <input type="hidden" name="id" value={member.id} />
            <input type="hidden" name="version" value={version} />
          </DeleteForm>
        </div>
      )}
    </>
  );
}
