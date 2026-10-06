import Section from "@/components/Section";
import { events } from "@/data/home";

export default function Events() {
  return (
    <Section eyebrow="Agenda" title="Eventos e palestras">
      <div className="grid gap-6 md:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.title}
            className="flex flex-col rounded-2xl border border-brand-800 bg-brand-900/50 p-6 transition-colors hover:border-brand-500"
          >
            <span className="w-fit rounded-full bg-brand-800 px-3 py-1 text-xs font-medium text-brand-200">
              {event.tag}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{event.title}</h3>
            <p className="mt-2 flex-1 text-sm text-brand-200/80">
              {event.description}
            </p>
            <p className="mt-6 text-sm text-brand-500">{event.date}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}