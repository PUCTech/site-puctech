import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-widest text-brand-200">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}