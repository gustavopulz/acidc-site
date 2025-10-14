import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  getAlbumsSortedDesc,
  getAlbumCoverImagesFromPhotos,
} from "../data/gallery";
import ImageLightbox from "./ImageLightbox";

const slides = getAlbumsSortedDesc();

export default function GallerySlider() {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const current = slides[index];
  const covers = useMemo(
    () => getAlbumCoverImagesFromPhotos(current.photos, 5),
    [current]
  );

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
          {covers.map((src, i) => (
            <button
              type="button"
              key={i}
              onClick={() => {
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5 group"
              aria-label={`Ampliar ${current.title} foto ${i + 1}`}
            >
              <img
                src={src}
                alt={`${current.title} foto ${i + 1}`}
                className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                loading="lazy"
              />
            </button>
          ))}

          {/* tile final com ícone de plus e link Ver mais */}
          <div className="col-span-2 sm:col-span-1">
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
          srcList={covers}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setLightboxIndex}
          caption={(i) => `${current.title} — Foto ${i + 1}`}
        />
      )}
    </div>
  );
}
