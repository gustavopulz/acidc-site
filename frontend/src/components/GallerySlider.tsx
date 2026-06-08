import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAlbums } from "../hooks/useAlbums";
import { youtubeEmbed, getYouTubeId } from "../lib/youtube";
import ImageLightbox from "./ImageLightbox";

const BASE = import.meta.env.VITE_API_URL ?? "";

type MediaItem = { type: "photo" | "youtube" | "video"; src: string; thumb: string; pinned: boolean };

function buildItems(album: ReturnType<typeof useAlbums>["albums"][number]): MediaItem[] {
  const photos: MediaItem[] = album.photos.map((p) => ({
    type: "photo", src: `${BASE}${p.url}`, thumb: `${BASE}${p.url}`, pinned: p.pinned,
  }));
  const videos: MediaItem[] = album.videos.map((v) => {
    const ytId = getYouTubeId(v.src);
    const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : "";
    return { type: ytId ? "youtube" : "video", src: v.src, thumb, pinned: v.pinned };
  });
  const pinned = [...videos.filter((v) => v.pinned), ...photos.filter((p) => p.pinned)];
  const rest   = [...videos.filter((v) => !v.pinned), ...photos.filter((p) => !p.pinned)];
  return [...pinned, ...rest].slice(0, 5);
}

export default function GallerySlider() {
  const { albums, loading } = useAlbums();
  const [index, setIndex]           = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [ytEmbed, setYtEmbed]       = useState<string | null>(null);

  const slides = albums.filter((a) => a.photos.length + a.videos.length > 0);
  const total   = slides.length;
  const current = slides[index];

  const covers = useMemo(() => (current ? buildItems(current) : []), [current]);
  const photoSrcs = covers.filter((i) => i.type === "photo").map((i) => i.src);

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-white/40 text-sm">
        Carregando galeria…
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-white/30 text-sm">
        Nenhum álbum disponível.
      </div>
    );
  }

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));

  return (
    <div className="relative">
      <header className="mb-4 flex items-baseline gap-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold">{current.title}</h3>
        <span className="text-sm text-white/60">{current.date}</span>
      </header>

      <div className="relative">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {covers.map((item, i) => {
            const photoIdx = covers.slice(0, i).filter((x) => x.type === "photo").length;
            return (
              <button key={i} type="button"
                onClick={() => {
                  if (item.type === "youtube") { setYtEmbed(youtubeEmbed(item.src)); }
                  else if (item.type === "photo") { setLightboxIndex(photoIdx); setLightboxOpen(true); }
                }}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5 group"
                aria-label={`${item.type === "photo" ? "Ampliar foto" : "Reproduzir vídeo"} ${i + 1}`}
              >
                {item.thumb
                  ? <img src={item.thumb} alt="" className="h-full w-full object-cover group-hover:scale-[1.02] transition" loading="lazy" />
                  : <div className="h-full w-full bg-black/40 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>}
                {item.type !== "photo" && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent-600 transition">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <span className="absolute right-2 bottom-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs">Vídeo</span>
                  </>
                )}
                {item.pinned && (
                  <span className="absolute right-2 top-2 bg-black/70 text-yellow-400 px-1.5 py-1 rounded text-xs backdrop-blur-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17l-5 5V6a2 2 0 012-2h6a2 2 0 012 2v16l-5-5z"/></svg>
                  </span>
                )}
              </button>
            );
          })}

          {/* Ver mais */}
          <Link to="/media" className="group block" aria-label="Ver mais na galeria">
            <div className="aspect-[4/3] grid place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/[0.06] transition">
              <div className="flex flex-col items-center gap-2 text-white">
                <div className="h-12 w-12 grid place-items-center rounded-full bg-white/10 border border-white/20 group-hover:bg-accent-600 group-hover:border-transparent transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <span className="text-sm tracking-wide uppercase text-white/80 group-hover:text-white">Ver mais</span>
              </div>
            </div>
          </Link>
        </div>

        {total > 1 && (
          <>
            <button onClick={prev} disabled={index === 0} aria-label="Slide anterior"
              className="absolute -left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/50 text-white/90 backdrop-blur hover:bg-white/10 disabled:opacity-40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={next} disabled={index === total - 1} aria-label="Próximo slide"
              className="absolute -right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/50 text-white/90 backdrop-blur hover:bg-white/10 disabled:opacity-40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-accent-500" : "w-5 bg-white/25 hover:bg-white/40"}`} />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <ImageLightbox srcList={photoSrcs} index={lightboxIndex}
          onClose={() => setLightboxOpen(false)} onIndexChange={setLightboxIndex}
          caption={(i) => `${current.title} — Foto ${i + 1}`} />
      )}

      {ytEmbed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setYtEmbed(null)}>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setYtEmbed(null)} className="mb-3 ml-auto flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              Fechar
            </button>
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe src={ytEmbed} className="w-full h-full" allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
