"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // No topo da página o cabeçalho fica "solto"; ao rolar, ganha fundo e linha.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `rounded-full px-3.5 py-1.5 transition-colors ${
      isActive(href)
        ? "bg-surface font-semibold text-ink"
        : "text-muted hover:text-ink"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-out ${
        scrolled || open
          ? "border-border/80 bg-white/80 backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo-puctech-ink.svg"
            alt="Logo da PUC Tech"
            width={310}
            height={82}
            loading="eager"
            className="h-7 w-auto"
          />
        </Link>
        {/* Processo Seletivo fica fora: no desktop ele é o botão da direita. */}
        <nav className="hidden items-center gap-1 text-[15px] lg:flex">
          {navLinks.slice(0, -1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/processo-seletivo"
          className="hidden justify-self-end rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white lg:inline-flex"
        >
          Processo Seletivo
        </Link>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-white px-5 py-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkClass(link.href)}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}