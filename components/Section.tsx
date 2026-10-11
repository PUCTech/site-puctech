import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "default" | "alt";
  children: ReactNode;
};

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  tone = "default",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 py-16 md:py-20 ${
        tone === "alt" ? "border-y border-brand-800 bg-brand-900/40" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-widest text-brand-200">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-4 max-w-3xl text-lg text-brand-200/90">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}