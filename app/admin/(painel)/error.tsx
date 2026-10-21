"use client";

// Falha ao falar com o banco (Supabase fora do ar, variáveis faltando…).
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-5xl">Não deu para carregar</h1>
      <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">
        O admin lê e salva os dados no Supabase. Confira se ele está no ar e se SUPABASE_URL e
        SUPABASE_SECRET_KEY estão configurados.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 font-mono text-sm text-accent-ink underline underline-offset-4 hover:text-ink"
      >
        tentar de novo
      </button>
    </div>
  );
}
