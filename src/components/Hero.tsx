import Button from "./Button";
import Badge from "./Badge";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-black to-[#150404]" />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% -20%, rgba(255,122,0,.35), transparent 45%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center">
        <div className="flex justify-center mb-6">
          <img
            src="/acidc-logo.png"
            alt="ACID/C"
            className="h-24 sm:h-32 md:h-40 w-auto drop-shadow-[0_0_24px_rgba(255,90,90,0.6)]"
          />
        </div>
        <Badge>We Salute You!</Badge>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">
          ACID/C - Uma Experiência Única e Fiel à Lendária banda de Rock
          Australiana!
        </h1>
        <p className="mt-4 text-white/80 max-w-5xl mx-auto">
          Uma verdadeira viagem no tempo, passando por todas as fases da banda,
          com uma recriação detalhada dos elementos icônicos do AC/DC, desde os
          instrumentos, roupas e alegorias de palco, como o famoso sino de
          "Hells Bells" e os explosivos tiros de canhão em "For Those About To
          Rock" ao famoso ‘’striptease’’ em "The Jack" um dos momentos mais
          aguardados da apresentação. Se você deseja oferecer aos seus clientes
          uma noite do mais puro Rock, com energia, adrenalina e um som
          autêntico, a nossa banda é a escolha perfeita. Estamos prontos para
          agitar o seu bar e fazer todos vivenciarem a verdadeira essência do
          AC/DC!{" "}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/shows">
            <Button>Ver Agenda</Button>
          </Link>
          <Link to="/contato">
            <Button variant="ghost">Contratar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
