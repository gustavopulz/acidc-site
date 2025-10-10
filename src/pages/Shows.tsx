import Section from "../components/Section";
import ShowCard from "../components/ShowCard";
import { shows } from "../data/shows";

export default function Shows() {
  return (
    <Section title="Agenda" subtitle="Atualizamos as datas com frequência.">
      <div className="grid gap-4">
        {shows.map((s, i) => (
          <ShowCard key={i} show={s} />
        ))}
      </div>
      <p className="text-white/60 mt-6 text-sm">
        Sujeito a alterações sem aviso prévio.
      </p>
    </Section>
  );
}
