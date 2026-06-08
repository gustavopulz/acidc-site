import Section from "../components/Section";
import ImageLightbox from "../components/ImageLightbox";
import { useAlbums } from "../hooks/useAlbums";
import { youtubeEmbed, getYouTubeId } from "../lib/youtube";
import { useState, useEffect } from "react";

const BASE = import.meta.env.VITE_API_URL ?? "";

type MediaItem = { type: "photo" | "youtube" | "video"; src: string; thumb: string };

function buildItems(album: ReturnType<typeof useAlbums>["albums"][number]): MediaItem[] {
  const mkVid = (v: { src: string; thumbnail?: string; pinned: boolean }): MediaItem & { pinned: boolean } => {
    const ytId = getYouTubeId(v.src);
    const thumb = ytId
      ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
      : v.thumbnail ? `${BASE}${v.thumbnail}` : "";
    return { type: ytId ? "youtube" : "video", src: v.src, thumb, pinned: v.pinned };
  };
  const mkPic = (p: { url: string; pinned: boolean }): MediaItem & { pinned: boolean } => ({
    type: "photo", src: `${BASE}${p.url}`, thumb: `${BASE}${p.url}`, pinned: p.pinned,
  });
  const all = [
    ...album.videos.filter((v) => v.pinned).map(mkVid),
    ...album.photos.filter((p) => p.pinned).map(mkPic),
    ...album.videos.filter((v) => !v.pinned).map(mkVid),
    ...album.photos.filter((p) => !p.pinned).map(mkPic),
  ];
  return all;
}

type VideoModal = { src: string; youtube: boolean } | null;

function VideoOverlay({ modal, onClose }: { modal: VideoModal; onClose: () => void }) {
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modal, onClose]);

  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
        </svg>
      </button>
      <div className="w-full max-w-4xl">
        <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
          {modal.youtube
            ? <iframe src={modal.src} className="w-full h-full" allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            : <video src={modal.src} controls autoPlay className="w-full h-full" />}
        </div>
      </div>
    </div>
  );
}

function AlbumSection({ album }: { album: ReturnType<typeof useAlbums>["albums"][number] }) {
  const items       = buildItems(album);
  const [lbIdx, setLbIdx]           = useState<number | null>(null);
  const [videoModal, setVideoModal] = useState<VideoModal>(null);

  const photoSrcs = items.filter((i) => i.type === "photo").map((i) => i.src);

  if (items.length === 0) return null;

  const subtitle = `${album.date} — ${album.photos.length} foto${album.photos.length !== 1 ? "s" : ""} · ${album.videos.length} vídeo${album.videos.length !== 1 ? "s" : ""}`;

  return (
    <Section title={album.title} subtitle={subtitle}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 mb-8">
        {items.map((item, i) => {
          const photoIdx = items.slice(0, i).filter((x) => x.type === "photo").length;
          return (
            <button key={i} type="button"
              onClick={() => {
                if (item.type === "photo") setLbIdx(photoIdx);
                else if (item.type === "youtube") setVideoModal({ src: youtubeEmbed(item.src), youtube: true });
                else setVideoModal({ src: `${BASE}${item.src}`, youtube: false });
              }}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5 group"
              aria-label={item.type === "photo" ? `Ampliar foto ${i + 1}` : `Reproduzir vídeo ${i + 1}`}
            >
              {item.thumb
                  ? <img src={item.thumb} alt="" className="h-full w-full object-cover group-hover:scale-[1.02] transition" loading="lazy" />
                  : <div className="h-full w-full bg-black/40 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>}

              {item.type !== "photo" && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-14 w-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent-600 transition">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <span className="absolute right-2 bottom-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M6 4.5v7l6-3.5-6-3.5z"/></svg>
                    Vídeo
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {lbIdx !== null && (
        <ImageLightbox srcList={photoSrcs} index={lbIdx}
          onClose={() => setLbIdx(null)} onIndexChange={setLbIdx}
          caption={(i) => `${album.title} — Foto ${i + 1}`} />
      )}

      <VideoOverlay modal={videoModal} onClose={() => setVideoModal(null)} />
    </Section>
  );
}

export default function Media() {
  const { albums, loading } = useAlbums();

  if (loading) {
    return (
      <Section title="Galeria">
        <div className="flex items-center justify-center h-48 text-white/40 text-sm">Carregando…</div>
      </Section>
    );
  }

  if (albums.length === 0) {
    return (
      <Section title="Galeria">
        <p className="text-white/50 text-sm">Nenhum álbum disponível ainda.</p>
      </Section>
    );
  }

  const sorted = [...albums].sort((a, b) => {
    const parse = (d: string) => {
      const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
      return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])).getTime() : 0;
    };
    return parse(b.date) - parse(a.date);
  });

  return <>{sorted.map((album) => <AlbumSection key={album.id} album={album} />)}</>;
}
