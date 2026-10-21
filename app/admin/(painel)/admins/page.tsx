import { addAdmin, removeAdmin } from "@/app/admin/actions";
import { AdminForm, DeleteForm, Field } from "@/components/admin/forms";
import { input } from "@/components/admin/styles";
import { admins, owner, requireAdmin } from "@/lib/admin-auth";

const date = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

export default async function AdminAdmins() {
  const me = await requireAdmin();
  const list = await admins("select=*&order=created_at");

  return (
    <>
      <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-5xl">Admins</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-pretty text-muted">
        Quem pode entrar aqui, pela conta do GitHub. A conta fica confirmada no primeiro login da pessoa: se
        depois ela trocar de usuário no GitHub, continua com acesso.
      </p>

      <ul className="mt-12 border-b border-border">
        {list.map((admin) => (
          <li key={admin.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border py-4">
            <span className="min-w-0 flex-1">
              <a
                href={`https://github.com/${admin.github_login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
              >
                @{admin.github_login}
              </a>
              {admin.id === me.id && <span className="ml-2 font-mono text-xs text-muted">você</span>}
              <span className="mt-0.5 block font-mono text-sm text-muted">
                {admin.github_id === null ? "ainda não entrou" : "conta confirmada"} · adicionado por{" "}
                {admin.added_by === "ADMIN_GITHUB" ? "ADMIN_GITHUB" : `@${admin.added_by}`} em {date(admin.created_at)}
              </span>
            </span>
            {admin.id !== me.id && admin.github_login !== owner() && (
              <DeleteForm
                action={removeAdmin}
                what={`@${admin.github_login}`}
                note="A pessoa perde o acesso na hora."
                label="remover"
              >
                <input type="hidden" name="id" value={admin.id} />
              </DeleteForm>
            )}
          </li>
        ))}
      </ul>

      <AdminForm action={addAdmin} submit="Adicionar admin" className="mt-14 max-w-md">
        <Field label="usuário do GitHub" hint="Ela entra pelo botão “Entrar com GitHub” da tela de login.">
          <input
            name="login"
            required
            placeholder="@usuario"
            autoComplete="off"
            spellCheck={false}
            className={`${input} font-mono`}
          />
        </Field>
      </AdminForm>
    </>
  );
}
