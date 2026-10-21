"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { button } from "@/components/Section";
import type { FormState } from "@/app/admin/actions";

type Action = (state: FormState, form: FormData) => Promise<FormState>;

/** Campo com rótulo em mono, no tom do resto do site. */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-sm text-muted">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-sm text-muted">{hint}</span>}
    </label>
  );
}

function Submit({ children, busy, className }: { children: ReactNode; busy: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:cursor-wait disabled:opacity-60`}>
      {pending ? busy : children}
    </button>
  );
}

/** Formulário de uma ação do servidor: mostra o erro que ela devolver. */
export function AdminForm({
  action,
  submit,
  busy = "Salvando…",
  className = "",
  children,
}: {
  action: Action;
  submit: ReactNode;
  busy?: string;
  className?: string;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className={className}>
      {children}
      {state.error && (
        <p role="alert" className="mt-6 text-[15px] font-medium text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      <div className="mt-8">
        <Submit busy={busy} className={`${button.base} ${button.primary}`}>
          {submit}
        </Submit>
      </div>
    </form>
  );
}

/** Botão de apagar: pede confirmação antes de mandar. */
export function DeleteForm({
  action,
  what,
  note = "Isso sai do site na hora.",
  label = `apagar ${what}`,
  children,
}: {
  action: Action;
  what: string;
  note?: string;
  label?: string;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirm(`Apagar ${what}? ${note}`)) event.preventDefault();
      }}
    >
      {children}
      <button
        type="submit"
        className="font-mono text-sm text-red-600 underline underline-offset-4 hover:text-ink dark:text-red-400"
      >
        {label}
      </button>
      {state.error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </form>
  );
}

/** Abas do painel; a da página atual fica marcada como no menu do site. */
export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1">
      {[
        { href: "/admin/projetos", label: "Projetos" },
        { href: "/admin/membros", label: "Membros" },
        { href: "/admin/admins", label: "Admins" },
      ].map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
              active ? "bg-surface text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Aviso depois de salvar/apagar (?ok=salvo ou ?ok=apagado). */
export function Notice({ ok }: { ok?: string }) {
  const text = ok === "salvo" ? "Salvo!" : ok === "apagado" ? "Apagado." : null;
  if (!text) return null;
  return (
    <p role="status" className="mb-10 border-l-2 border-accent pl-4 text-[15px]">
      <strong className="font-semibold">{text}</strong>{" "}
      <span className="text-muted">O site já mostra a mudança.</span>
    </p>
  );
}
