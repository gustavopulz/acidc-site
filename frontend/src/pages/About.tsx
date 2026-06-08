import Section from "../components/Section";

export default function About() {
  return (
    <Section
      title="Sobre a ACID/C"
      subtitle="Fidelidade sonora, presença de palco e paixão por AC/DC."
    >
      <div className="prose prose-invert max-w-none">
        <p>
          Fundada em 2008 por Yuri Malvestiti (Guitarra Solo) e Neyton Jr.
          (Bateria), a banda se tornou referência na região de Araras, Limeira,
          Mogi Mirim e Campinas, por sua fiel caracterização, tanto visual, como
          sonoramente. Nosso setlist é cuidadosamente escolhido, com músicas que
          vão de Bon Scott a Brian Johnson, sempre mantendo a autenticidade do
          som original, o vocalista Lupa Rock é um verdadeiro mestre na
          interpretação, no carisma e timbre de ambos os cantores, juntos com o
          guitarrista Gustavo e o baixista Daniel, a banda entrega uma
          performance vibrante, cheia de atitude e precisão!
        </p>
        <p>
          A banda já realizou abertura para nomes importantes do Rock Nacional,
          como Supla e Detonator, a voz do Massacration, e para a banda Matanza,
          do cantor Jimmy London. Já foi Headliner de festivais promovidos pela
          Prefeitura de Mogi Mirim, Encontros e Aniversários de Moto Clubes, e
          do Porks Festival. Nosso objetivo sempre foi oferecer uma performance
          fiel e empolgante, capaz de recriar a energia única dos shows da maior
          banda de Rock de todos os tempos.
        </p>
        <p>
          Nós vamos além de apenas tocar as músicas: trazemos uma experiência
          completa. Roupas, acessórios e instrumentos idênticos aos da banda
          original, criando um show visual e sonoramente impecável, que deixa o
          público completamente imerso na magia do AC/DC. We Salute You!
        </p>
      </div>

      {/* Imagem da banda */}
      <div className="mt-10 flex justify-center">
        <img
          src="/uploads/foto-capa.png"
          alt="Foto da banda ACID/C"
          className="rounded-xl border border-white/10 shadow-[0_0_25px_rgba(255,90,90,0.3)] w-full h-auto"
        />
      </div>
    </Section>
  );
}
