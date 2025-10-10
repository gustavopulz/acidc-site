import Section from "../components/Section";

export default function About() {
  return (
    <Section
      title="Sobre a ACID/C"
      subtitle="Fidelidade sonora, presença de palco e paixão por AC/DC."
    >
      <div className="prose prose-invert max-w-none">
        <p>
          A ACID/C nasceu da vontade de homenagear uma das bandas mais icônicas
          do rock. Nosso show traz a estética, a energia e os clássicos que
          atravessam gerações. Com figurino, timbres e performance
          cuidadosamente trabalhados, oferecemos uma experiência intensa e
          envolvente para casas de show, festivais e eventos corporativos.
        </p>
        <p>
          Formada por músicos experientes, a banda entrega um repertório afiado,
          interação com o público e uma produção pronta para palcos de todos os
          tamanhos.
        </p>
      </div>

      {/* Imagem da banda */}
      <div className="mt-10 flex justify-center">
        <img
          src="/banda.png"
          alt="Foto da banda ACID/C"
          className="rounded-xl border border-white/10 shadow-[0_0_25px_rgba(255,90,90,0.3)] w-full h-auto"
        />
      </div>
    </Section>
  );
}
