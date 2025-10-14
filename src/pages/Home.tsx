import Hero from "../components/Hero";
import Section from "../components/Section";
import ShowCard from "../components/ShowCard";
import { shows } from "../data/shows";
import { Link } from "react-router-dom";
import GallerySlider from "../components/GallerySlider";
import YouTubeSlider from "../components/YouTubeSlider";
import Button from "../components/Button";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Quem Somos */}
      <Section title="Quem Somos">
        <div className="prose prose-invert max-w-none text-white/85">
          <p>
            Fundada em 2008 por Yuri Malvestiti (Guitarra Solo) e Neyton Jr.
            (Bateria), a banda se tornou referência na região de Araras,
            Limeira, Mogi Mirim e Campinas, por sua fiel caracterização, tanto
            visual, como sonoramente. Nosso setlist é cuidadosamente escolhido,
            com músicas que vão de Bon Scott a Brian Johnson, sempre mantendo a
            autenticidade do som original, o vocalista Lupa Rock é um verdadeiro
            mestre na interpretação, no carisma e timbre de ambos os cantores,
            juntos com o guitarrista Gustavo e o baixista Daniel, a banda
            entrega uma performance vibrante, cheia de atitude e precisão!
          </p>
          <p>
            A banda já realizou abertura para nomes importantes do Rock
            Nacional, como Supla e Detonator, a voz do Massacration, e para a
            banda Matanza, do cantor Jimmy London. Já foi Headliner de festivais
            promovidos pela Prefeitura de Mogi Mirim, Encontros e Aniversários
            de Moto Clubes, e do Porks Festival. Nosso objetivo sempre foi
            oferecer uma performance fiel e empolgante, capaz de recriar a
            energia única dos shows da maior banda de Rock de todos os tempos.
          </p>
          <p>
            Nós vamos além de apenas tocar as músicas: trazemos uma experiência
            completa. Roupas, acessórios e instrumentos idênticos aos da banda
            original, criando um show visual e sonoramente impecável, que deixa
            o público completamente imerso na magia do AC/DC. We Salute You!
          </p>
        </div>
      </Section>

      {/* Fotos e Vídeos */}
      <Section title="Fotos e Vídeos" subtitle="Destaques dos últimos shows.">
        <GallerySlider />
        <div className="mt-6 text-right">
          <Link to="/media" className="underline hover:text-white">
            Ver tudo na galeria →
          </Link>
        </div>
      </Section>

      {/* Redes Sociais */}
      <Section title="Redes Sociais" subtitle="Siga e não perca nada.">
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://instagram.com/acidcband"
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/10 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6 text-white"
              fill="currentColor"
              aria-hidden
            >
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 16.8 2.8 2.8 0 0 0 12 9.2ZM18.2 6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
            </svg>
            <div>
              <div className="font-semibold">Instagram</div>
              <div className="text-white/70 text-sm">
                Fotos, bastidores e stories
              </div>
            </div>
          </a>
          <a
            href="https://youtube.com/@acid_c?si=rFqVMI-3RS76xbei"
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/10 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6 text-white"
              fill="currentColor"
              aria-hidden
            >
              <path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5A3.1 3.1 0 0 0 .5 6.2 32.4 32.4 0 0 0 0 12a32.4 32.4 0 0 0 .5 5.8 3.1 3.1 0 0 0 2.2 2.2c1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2A32.4 32.4 0 0 0 24 12a32.4 32.4 0 0 0-.5-5.8ZM9.8 15.5v-7l6.3 3.5-6.3 3.5Z" />
            </svg>
            <div>
              <div className="font-semibold">YouTube</div>
              <div className="text-white/70 text-sm">
                Vídeos completos e clipes
              </div>
            </div>
          </a>
        </div>
      </Section>

      {/* Vídeos do YouTube (última seção) */}
      <Section title="YouTube" subtitle="Últimos vídeos do nosso canal.">
        <YouTubeSlider />
      </Section>

      {/* Agenda */}
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

      {/* Contato */}
      <Section title="Contato" subtitle="Orçamentos, datas e informações.">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/contato" className="underline hover:text-white">
            <Button className="!px-5 !py-1.5 text-sm">
              Falar com a banda →
            </Button>
          </Link>
        </div>
      </Section>

      {/* Ouça um preview (deve ser uma das últimas)
      <Section title="Ouça um preview" subtitle="Gravado ao vivo, sem truques.">
        <div className="grid gap-4 sm:grid-cols-2">
          <AudioPlayer src="/back-in-black.mp3" title="Back In Black" />
          <AudioPlayer src="/highway-to-hell.mp3" title="Highway To Hell" />
        </div>
      </Section> */}
    </>
  );
}
