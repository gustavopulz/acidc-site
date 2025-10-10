import Hero from "../components/Hero";
import Section from "../components/Section";
import ShowCard from "../components/ShowCard";
import { shows } from "../data/shows";
import AudioPlayer from "../components/AudioPlayer";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Hero />

      <Section
        title="Próximos Shows"
        subtitle="Sinta o peso das guitarras — confira as datas e garanta seu ingresso."
      >
        <div className="grid gap-4">
          {shows.map((s, i) => (
            <ShowCard key={i} show={s} />
          ))}
        </div>
        <div className="mt-6 text-right">
          <Link to="/shows" className="underline hover:text-white">
            Ver agenda completa →
          </Link>
        </div>
      </Section>

      <Section title="Ouça um preview" subtitle="Gravado ao vivo, sem truques.">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* use arquivos locais em /public ou URLs externas */}
          <AudioPlayer src="/back-in-black.mp3" title="Back In Black" />
          <AudioPlayer
            src="/highway-to-hell-sample.mp3"
            title="Highway To Hell"
          />
        </div>
      </Section>

      <Section
        title="Na mídia"
        subtitle="Vídeos e registros que captam a vibração da plateia."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/54LEywabkl4"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/pAgnJDJN4VA"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </Section>
    </>
  );
}
