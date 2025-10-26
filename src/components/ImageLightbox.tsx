import { useEffect, useState } from "react";

type ImageLightboxProps = {
  srcList: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
  caption?: string | ((index: number) => string | undefined);
  isVideo?: (index: number) => boolean;
};

export default function ImageLightbox({
  srcList,
  index,
  onClose,
  onIndexChange,
  caption,
  isVideo,
}: ImageLightboxProps) {
  const total = srcList.length;
  const current = srcList[index];
  const [fadeIn, setFadeIn] = useState(true);

  // ESC/arrow keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + total) % total);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onClose, onIndexChange]);

  // Lock scroll on mount
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverscroll = (document.body.style as any).overscrollBehavior;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    (document.body.style as any).overscrollBehavior = "contain";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      (document.body.style as any).overscrollBehavior = prevBodyOverscroll;
    };
  }, []);

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (total <= 1) return;
    const next = new Image();
    next.src = srcList[(index + 1) % total];
    const prev = new Image();
    prev.src = srcList[(index - 1 + total) % total];
  }, [index, total, srcList]);

  // Fade animation
  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [index]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      aria-modal
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Click zones for prev/next */}
      {total > 1 && (
        <>
          <div
            className="absolute inset-y-0 left-0 w-1/3 cursor-pointer"
            onClick={() => onIndexChange((index - 1 + total) % total)}
            aria-hidden
          />
          <div
            className="absolute inset-y-0 right-0 w-1/3 cursor-pointer"
            onClick={() => onIndexChange((index + 1) % total)}
            aria-hidden
          />
        </>
      )}

      {/* Botão fechar */}
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
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

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={() => onIndexChange((index - 1 + total) % total)}
            aria-label="Anterior"
            className="absolute left-6 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
          >
            <svg
              width="22"
              height="22"
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
            onClick={() => onIndexChange((index + 1) % total)}
            aria-label="Próxima"
            className="absolute right-6 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
          >
            <svg
              width="22"
              height="22"
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

      {/* Imagem ou vídeo */}
      <figure className="flex items-center justify-center w-full max-w-[95vw] max-h-[90vh]">
        {isVideo && isVideo(index) ? (
          <video
            src={current}
            controls
            autoPlay
            className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg select-none transition-opacity duration-300 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
            style={{ background: '#000' }}
          />
        ) : (
          <img
            src={current}
            alt=""
            className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg select-none transition-opacity duration-300 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        )}
        {caption && (
          <figcaption className="absolute bottom-6 w-full text-center text-white/80 text-sm">
            {typeof caption === "function" ? caption(index) : caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
