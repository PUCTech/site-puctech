import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject, saveProject } from "@/app/admin/actions";
import { AdminForm, DeleteForm, Field } from "@/components/admin/forms";
import { ImageInput } from "@/components/admin/ImageInput";
import { input } from "@/components/admin/styles";
import { projectAreas, projectStatuses } from "@/data/projects";
import { loadProjects } from "@/lib/admin-data";

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isNew = slug === "novo";
  const entry = isNew ? null : (await loadProjects()).find((item) => item.project.slug === slug);
  if (!isNew && !entry) notFound();
  const project = entry?.project;

  return (
    <>
      <Link href="/admin/projetos" className="font-mono text-sm text-accent-ink underline underline-offset-4 hover:text-ink">
        ← projetos
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
        {project ? project.title : "Novo projeto"}
      </h1>
      {project && <p className="mt-3 font-mono text-sm text-muted">/projetos/{project.slug}</p>}

      <AdminForm action={saveProject} submit={isNew ? "Criar projeto" : "Salvar"} className="mt-12 max-w-3xl">
        <input type="hidden" name="original" value={project?.slug ?? ""} />
        <input type="hidden" name="sha" value={entry?.sha ?? ""} />
        <input type="hidden" name="currentImage" value={project?.image ?? ""} />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="título">
              <input name="title" required defaultValue={project?.title} className={input} />
            </Field>
          </div>
          {isNew && (
            <div className="sm:col-span-2">
              <Field label="endereço" hint="Opcional. Sem preencher, sai do título (ex.: /projetos/meu-projeto).">
                <input name="slug" pattern="[a-z0-9\-]+" placeholder="meu-projeto" className={`${input} font-mono`} />
              </Field>
            </div>
          )}
          <div className="sm:col-span-2">
            <Field label="resumo" hint="Uma ou duas frases. Aparece na lista de projetos.">
              <input name="summary" defaultValue={project?.summary} className={input} />
            </Field>
          </div>
          <Field label="área">
            <select name="area" defaultValue={project?.area ?? ""} className={input}>
              <option value="">Sem área</option>
              {projectAreas.map((area) => (
                <option key={area.title}>{area.title}</option>
              ))}
            </select>
          </Field>
          <Field label="status">
            <select name="status" defaultValue={project?.status ?? ""} className={input}>
              <option value="">Sem status</option>
              {projectStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="período" hint="Ex.: 2026.1">
            <input name="period" defaultValue={project?.period} className={input} />
          </Field>
          <Field label="ordem" hint="Menor aparece primeiro.">
            <input name="order" type="number" defaultValue={entry && entry.order !== 1000 ? entry.order : ""} className={input} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="stack" hint="Separe por vírgula.">
              <input name="tech" defaultValue={project?.tech?.join(", ")} placeholder="Python, React, AWS" className={input} />
            </Field>
          </div>
          <Field label="equipe" hint="Uma pessoa por linha.">
            <textarea name="team" rows={4} defaultValue={project?.team?.join("\n")} className={input} />
          </Field>
          <Field label="repositório">
            <input name="repo" type="url" defaultValue={project?.repo} placeholder="https://github.com/…" className={input} />
          </Field>

          <div className="sm:col-span-2">
            <span className="font-mono text-sm text-muted">imagem</span>
            <div className="mt-2">
              <ImageInput name="image" removeName="removeImage" current={project?.image} shape="wide" />
            </div>
          </div>

          {[
            { name: "description", label: "sobre o projeto", value: project?.description, required: true },
            { name: "objective", label: "objetivo e escopo", value: project?.objective },
            { name: "results", label: "resultados e aprendizados", value: project?.results },
          ].map((field) => (
            <div key={field.name} className="sm:col-span-2">
              <Field label={field.label} hint={field.required ? "Obrigatório. Linha em branco separa parágrafos." : undefined}>
                <textarea name={field.name} rows={6} required={field.required} defaultValue={field.value} className={input} />
              </Field>
            </div>
          ))}
        </div>
      </AdminForm>

      {project && entry && (
        <div className="mt-16 border-t border-border pt-8">
          <DeleteForm action={deleteProject} what="este projeto">
            <input type="hidden" name="original" value={project.slug} />
            <input type="hidden" name="sha" value={entry.sha} />
          </DeleteForm>
        </div>
      )}
    </>
  );
}
