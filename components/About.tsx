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
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-8 text-center md:p-14">
        <h2 className="text-3xl font-bold text-brand-950 md:text-4xl">
          {about.title}
        </h2>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-brand-800">
          {about.paragraphs.map((text) => (
            <p key={text}>{withBold(text)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}