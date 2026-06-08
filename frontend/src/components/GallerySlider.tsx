import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getAlbumsPinnedFirst } from "../data/gallery";
import ImageLightbox from "./ImageLightbox";

const slides = getAlbumsPinnedFirst();
export default function GallerySlider() {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const current = slides[index];
  // Junta fotos e vídeos para exibir no slider
  const covers = useMemo(() => {
    const pinnedPhotos =
      current.pinned?.photos?.map((src) => ({
        type: "photo",
        src,
        pinned: true,
      })) || [];

    const pinnedVideos =
      current.pinned?.videos?.map((v) => ({
        type: "video",
        src: v.src,
        pinned: true,
      })) || [];

    const pinnedItems = [...pinnedVideos, ...pinnedPhotos];

    const normalPhotos = current.photos
      .filter((src) => !pinnedPhotos.some((p) => p.src === src))
      .map((src) => ({ type: "photo", src, pinned: false }));

    const normalVideos = (current.videos || [])
      .filter((v) => !pinnedVideos.some((p) => p.src === v.src))
      .map((v) => ({ type: "video", src: v.src, pinned: false }));

    const combined = [...pinnedItems, ...normalVideos, ...normalPhotos];

    return combined.slice(0, 5);
  }, [current]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));

  return (
    <div className="relative">
      {/* header */}
      <header className="mb-4 flex items-baseline gap-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold">{current.title}</h3>
        <span className="text-sm text-white/60">{current.date}</span>
      </header>

      {/* slide content */}
      <div className="relative">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {covers.map((item, i) => (
            <button
              type="button"
              key={i}
              onClick={() => {
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5 group"
              aria-label={`Ampliar ${current.title} ${
                item.type === "video" ? "vídeo" : "foto"
              } ${i + 1}`}
            >
              {/* imagem ou vídeo */}
              {item.type === "photo" ? (
                <img
                  src={item.src}
                  alt={`${current.title} foto ${i + 1}`}
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.src}
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                  preload="metadata"
                  muted
                  playsInline
                  poster="/video-thumb.png"
                  ref={(el) => {
                    if (!el) return;
                    el.addEventListener(
                      "loadeddata",
                      () => {
                        try {
                          // Gera thumbnail automática
                          const canvas = document.createElement("canvas");
                          const w = el.videoWidth;
                          const h = el.videoHeight;
                          if (!w || !h) return;
                          canvas.width = w;
                          canvas.height = h;
                          const ctx = canvas.getContext("2d");
                          ctx?.drawImage(el, 0, 0, w, h);
                          const dataURL = canvas.toDataURL("image/jpeg", 0.7);
                          el.setAttribute("poster", dataURL);
                        } catch (err) {
                          console.warn(
                            "Falha ao gerar thumbnail automática",
                            err
                          );
                        }
                      },
                      { once: true }
                    );
                  }}
                />
              )}

              {/* selo de vídeo */}
              {item.type === "video" && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-14 w-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent-600 transition">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white"
                      >
                        <path d="M10 8l6 4-6 4V8z" />
                      </svg>
                    </div>
                  </div>

                  <span className="absolute right-2 bottom-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 4.5v7l6-3.5-6-3.5z" />
                    </svg>
                    Vídeo
                  </span>
                </>
              )}

              {/* ícone de fixado */}
              {item.pinned && (
                <span className="absolute right-2 top-2 bg-black/70 text-yellow-400 px-1.5 py-1 rounded text-xs flex items-center gap-1 backdrop-blur-sm">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17l-5 5V6a2 2 0 012-2h6a2 2 0 012 2v16l-5-5z" />
                  </svg>
                </span>
              )}
            </button>
          ))}

          {/* tile final com ícone de plus e link Ver mais */}
          <div className="col-span-1">
            <Link
              to="/media"
              className="group block"
              aria-label={`Ver mais fotos e vídeos de ${current.title}`}
            >
              <div className="aspect-[4/3] grid place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/[0.06] transition">
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="h-12 w-12 grid place-items-center rounded-full bg-white/10 border border-white/20 group-hover:bg-accent-600 group-hover:border-transparent transition">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                  </div>
                  <span className="text-sm tracking-wide uppercase text-white/80 group-hover:text-white">
                    Ver mais
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* arrows */}
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Slide anterior"
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
          disabled={index === total - 1}
          aria-label="Próximo slide"
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
      </div>

      {/* dots */}
      <div className="mt-4 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-8 bg-accent-500"
                : "w-5 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          srcList={covers.map((item) => item.src)}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setLightboxIndex}
          caption={(i) => {
            const item = covers[i];
            return `${current.title} — ${
              item.type === "video" ? "Vídeo" : "Foto"
            } ${i + 1}`;
          }}
          isVideo={(i) => covers[i]?.type === "video"}
        />
      )}
    </div>
  );
}
