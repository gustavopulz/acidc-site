import Section from "../components/Section";
import { getAlbumsSortedDesc } from "../data/gallery";

export default function Media() {
  return (
    <>
      {getAlbumsSortedDesc().map((album, idx) => (
        <Section
          key={idx}
          title={`${album.title}`}
          subtitle={`${album.date} — Fotos e Vídeos`}
        >
          {/* Fotos */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 mb-8">
            {album.photos.map((src, i) => (
              <figure
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5"
              >
                <img
                  src={src}
                  alt={`${album.title} foto ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>

          {/* Vídeos locais (mp4) se houver */}
          {!!album.videos?.length && (
            <div className="grid gap-6 sm:grid-cols-2 mb-2">
              {album.videos.map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-white/10 bg-black/60"
                >
                  <video controls className="w-full h-auto">
                    <source src={v.src} type="video/mp4" />
                  </video>
                  {v.title && (
                    <div className="px-3 py-2 text-sm text-white/80">
                      {v.title}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>
      ))}
    </>
  );
}
