import Section from "../components/Section";
import { getAlbumsSortedDesc } from "../data/gallery";
import { useState } from "react";
import ImageLightbox from "../components/ImageLightbox";

export default function Media() {
  const [open, setOpen] = useState(false);
  const [albumIdx, setAlbumIdx] = useState<number | null>(null);
  const [mediaIdx, setMediaIdx] = useState(0);

  const albums = getAlbumsSortedDesc();

  return (
    <>
      {albums.map((album, idx) => {
        // organiza fixados e normais — vídeos sempre antes das fotos
        const pinnedVideos =
          album.pinned?.videos?.map((v) => ({
            type: "video",
            src: v.src,
            pinned: true,
          })) || [];

        const pinnedPhotos =
          album.pinned?.photos?.map((src) => ({
            type: "photo",
            src,
            pinned: true,
          })) || [];

        const normalVideos =
          (album.videos || [])
            .filter((v) => !pinnedVideos.some((p) => p.src === v.src))
            .map((v) => ({
              type: "video",
              src: v.src,
              pinned: false,
            })) || [];

        const normalPhotos =
          album.photos
            .filter((src) => !pinnedPhotos.some((p) => p.src === src))
            .map((src) => ({
              type: "photo",
              src,
              pinned: false,
            })) || [];

        const allItems = [
          ...pinnedVideos,
          ...pinnedPhotos,
          ...normalVideos,
          ...normalPhotos,
        ];

        return (
          <Section
            key={idx}
            title={album.title}
            subtitle={`${album.date} — Fotos e Vídeos`}
          >
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 mb-8">
              {allItems.map((item, i) => (
                <button
                  type="button"
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5 group"
                  onClick={() => {
                    setAlbumIdx(idx);
                    setMediaIdx(i);
                    setOpen(true);
                  }}
                  aria-label={`Ampliar ${album.title} ${
                    item.type === "video" ? "vídeo" : "foto"
                  } ${i + 1}`}
                >
                  {item.type === "photo" ? (
                    <img
                      src={item.src}
                      alt={`${album.title} foto ${i + 1}`}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                      loading="lazy"
                    />
                  ) : (
                    <>
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
                                const canvas = document.createElement("canvas");
                                const w = el.videoWidth;
                                const h = el.videoHeight;
                                if (!w || !h) return;
                                canvas.width = w;
                                canvas.height = h;
                                const ctx = canvas.getContext("2d");
                                ctx?.drawImage(el, 0, 0, w, h);
                                const dataURL = canvas.toDataURL(
                                  "image/jpeg",
                                  0.7
                                );
                                el.setAttribute("poster", dataURL);
                              } catch {}
                            },
                            { once: true }
                          );
                        }}
                      />

                      {/* Ícone de Play central */}
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
                    </>
                  )}

                  {/* selo de vídeo */}
                  {item.type === "video" && (
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
                  )}

                  {/* selo fixado */}
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
            </div>

            {/* LIGHTBOX */}
            {open && albumIdx === idx && (
              <ImageLightbox
                srcList={allItems.map((m) => m.src)}
                index={mediaIdx}
                onClose={() => setOpen(false)}
                onIndexChange={setMediaIdx}
                caption={(i) =>
                  `${album.title} — ${
                    allItems[i].type === "video" ? "Vídeo" : "Foto"
                  } ${i + 1}`
                }
                isVideo={(i) => allItems[i].type === "video"}
              />
            )}
          </Section>
        );
      })}
    </>
  );
}
