import Button from "./Button";

export interface ShowInfo {
  date: string;
  city: string;
  venue: string;
  status?: "tickets" | "soldout" | "soon";
  link?: string;
}

export default function ShowCard({ show }: { show: ShowInfo }) {
  const { date, city, venue, status, link } = show;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur transition hover:bg-white/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Esquerda — cidade e local */}
        <div className="flex-1">
          <p className="text-white text-lg font-semibold leading-tight">
            {city}
          </p>
          <p className="text-white/70 text-sm">{venue}</p>
        </div>

        {/* Centro — data */}
        <div className="text-white/80 text-sm font-mono sm:w-32">{date}</div>

        {/* Direita — status/botão */}
        <div className="flex justify-center sm:justify-end sm:w-32">
          {status === "soldout" && (
            <span className="px-3 py-1 rounded-full bg-accent-800 text-white text-xs font-medium">
              Esgotado
            </span>
          )}
          {status === "soon" && (
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
              Em breve
            </span>
          )}
          {status === "tickets" && (
            <a href={link} target="_blank" rel="noreferrer">
              <Button className="!px-5 !py-1.5 text-sm">Ingressos</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
