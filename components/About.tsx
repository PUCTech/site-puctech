import { about } from "@/data/home";

export default function About() {
  return (
    <section id="sobre" className="scroll-mt-16 px-6 pt-16 md:pt-20">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-white p-8 md:grid-cols-12 md:p-14">
        <div className="md:col-span-5">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-500">
            Sobre
          </p>
          <h2 className="mt-2 text-3xl font-bold text-brand-950 md:text-4xl">
            {about.title}
          </h2>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-brand-800 md:col-span-7">
          {about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}