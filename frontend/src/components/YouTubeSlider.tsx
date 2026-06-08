import { useEffect, useMemo, useState } from "react";

// Tipagem simplificada
type YTVideo = { id: string; title: string; thumbnail: string };

const FALLBACK: YTVideo[] = [];
const CHANNEL_ID = "UCbYAtAl3uGzFQwS42T0A5pw"; // Canal ACID/C

// Modo temporário: vídeos estáticos definidos pelo usuário
const STATIC_VIDEOS: YTVideo[] = [
  {
    id: "6hqAaxIHDvA",
    title: "ACID/C - You Shook Me All Night Long",
    thumbnail: "https://i.ytimg.com/vi/6hqAaxIHDvA/hqdefault.jpg",
  },
  {
    id: "kP4X27VE70M",
    title: "ACID/C - Rock n' Roll Train",
    thumbnail: "https://i.ytimg.com/vi/kP4X27VE70M/hqdefault.jpg",
  },
  {
    id: "UkY1m4t9LTI",
    title: "ACID/C - Highway to Hell",
    thumbnail: "https://i.ytimg.com/vi/UkY1m4t9LTI/hqdefault.jpg",
  },
];

export default function YouTubeSlider() {
  const [videos, setVideos] = useState<YTVideo[] | null>(null);
  const [index, setIndex] = useState(0); // índice da página
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<YTVideo | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Se existir lista estática, usa ela e não busca nada
    if (STATIC_VIDEOS.length > 0) {
      setVideos(STATIC_VIDEOS);
      return () => {
        cancelled = true;
      };
    }

    async function fetchRSS() {
      try {
        // Usa proxy público para evitar bloqueio CORS
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
          rssUrl
        )}`;

        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Erro ao buscar feed via proxy");

        const data = await res.json();
        const text = data.contents;

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        const entries = Array.from(xml.querySelectorAll("entry"));

        const items: YTVideo[] = entries.map((entry) => {
          const id = entry.querySelector("yt\\:videoId")?.textContent || "";
          const title = entry.querySelector("title")?.textContent || "";
          const thumb =
            entry.querySelector("media\\:thumbnail")?.getAttribute("url") || "";
          return { id, title, thumbnail: thumb };
        });

        if (!cancelled) setVideos(items);
      } catch (err) {
        console.error("Erro ao carregar vídeos:", err);
        if (!cancelled) setVideos(FALLBACK);
      }
    }

    fetchRSS();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = useMemo(
    () => (STATIC_VIDEOS.length > 0 ? STATIC_VIDEOS : videos ?? FALLBACK),
    [videos]
  );
  const total = list.length;
  const perPage = 2;
  const pageCount = Math.ceil(total / perPage);
  const start = index * perPage;
  const visible = total > 0 ? list.slice(start, start + perPage) : [];

  // Fecha modal com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setIndex((i) => Math.min(Math.max(0, pageCount - 1), i + 1));

  return (
    <div className="relative">
      <div className="relative">
        {visible.length > 0 ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {visible.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => {
                  setSelected(video);
                  setOpen(true);
                }}
                className="block text-left rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <div className="aspect-video relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 grid place-items-center bg-black/20">
                    <div className="h-14 w-14 grid place-items-center rounded-full bg-black/60 text-white border border-white/20">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-3 text-sm text-white/90 line-clamp-2">
                  {video.title}
                </div>
              </button>
            ))}
            {/* Se a página tiver apenas 1 vídeo, completa com um card de "ver mais" */}
            {visible.length === 1 && (
              <a
                href="https://www.youtube.com/@acid_c"
                target="_blank"
                rel="noreferrer noopener"
                className="block text-left rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
                aria-label="Ver mais vídeos no YouTube"
              >
                <div className="aspect-video relative">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="flex flex-col items-center gap-2 text-white/90">
                      <div className="h-14 w-14 grid place-items-center rounded-full bg-black/60 text-white border border-white/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5A3.1 3.1 0 0 0 .5 6.2 32.4 32.4 0 0 0 0 12a32.4 32.4 0 0 0 .5 5.8 3.1 3.1 0 0 0 2.2 2.2c1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2A32.4 32.4 0 0 0 24 12a32.4 32.4 0 0 0-.5-5.8ZM9.8 15.5v-7l6.3 3.5-6.3 3.5Z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">
                        Ver mais no YouTube
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                </div>
                <div className="p-3 text-sm text-white/80">
                  Abrir canal ACID/C
                </div>
              </a>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-white/80">
            <div className="font-semibold mb-1">Carregando vídeos...</div>
            <div className="text-sm">
              Aguarde enquanto buscamos o feed do canal ACID/C.
            </div>
          </div>
        )}

        {/* arrows */}
        {pageCount > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label="Vídeo anterior"
              className="absolute -left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/50 text-white/90 backdrop-blur hover:bg-white/10 disabled:opacity-40"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index === pageCount - 1}
              aria-label="Próximo vídeo"
              className="absolute -right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/50 text-white/90 backdrop-blur hover:bg-white/10 disabled:opacity-40"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* dots */}
      {pageCount > 1 && (
        <div className="mt-4 flex items-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para página ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-accent-500"
                  : "w-5 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Modal player */}
      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
          <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${selected.id}?autoplay=1`}
              title={selected.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
