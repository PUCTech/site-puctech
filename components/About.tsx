import { about } from "@/data/home";

// Texto entre **dois asteriscos** vira negrito.
function withBold(text: string) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function About() {
  return (
    <section id="sobre" className="scroll-mt-16 px-6 pt-16 md:pt-20">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-paper p-8 md:grid-cols-12 md:p-14">
        <div className="md:col-span-4">
          <h2 className="text-3xl font-bold text-brand-950 md:text-4xl">
            {about.title}
          </h2>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-brand-800 md:col-span-8">
          {about.paragraphs.map((text) => (
            <p key={text}>{withBold(text)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}