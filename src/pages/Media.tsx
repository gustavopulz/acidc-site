import Section from "../components/Section";

export default function Media() {
  return (
    <>
      <Section title="Clipes" subtitle="Alguns momentos de alta voltagem.">
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
              src="https://www.youtube.com/embed/v2AC41dglnM"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </Section>

      <Section title="Setlist">
        <ul className="grid gap-2 list-disc pl-6 text-white/80">
          <li>1. Back in Black</li>
          <li>2. Rock N' Roll Train</li>
          <li>3. Moneytalks</li>
          <li>4. High Voltage</li>
          <li>5. Dirty Deeds Done Dirt Cheap</li>
          <li>6. The Jack</li>
          <li>7. Bad Boy Boogie</li>
          <li>8. Touch Too Much</li>
          <li>9. Shoot to Thrill</li>
          <li>10. Hells Bells</li>
          <li>11. Thunderstruck</li>
          <li>12. Givin the Dog a Bone</li>
          <li>13. Jailbreak</li>
          <li>14. Rock N' Roll Damnation</li>
          <li>15. Whole Lotta Rosie</li>
          <li>16. T.N.T.</li>
          <li>17. Let There Be Rock</li>
          <li>18. Hard as a Rock</li>
          <li>19. Shot in the Dark</li>
          <li>20. You Shook Me All Night Long</li>
          <li>21. Big Gun</li>
          <li>22. Highway to Hell</li>
          <li>23. For Those About to Rock (We Salute You)</li>
        </ul>
      </Section>
    </>
  );
}
