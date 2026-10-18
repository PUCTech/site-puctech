"use client";

// Alterna entre claro e escuro. A troca usa View Transitions (fade da página
// inteira) quando o navegador suporta; sem suporte, troca direto.
export default function ThemeToggle({ label, title }: { label: string; title: string }) {
  const toggle = () => {
    const apply = () => {
      const dark = document.documentElement.classList.toggle("dark");
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch {}
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) document.startViewTransition(apply);
    else apply();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={title}
      className="inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
    >
      {/* Lua no claro, sol no escuro: o CSS escolhe qual mostrar, sem esperar o JavaScript. */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-[18px] dark:hidden">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden className="hidden size-[18px] dark:block">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
