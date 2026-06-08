import { useCallback, useEffect, useState, useRef } from "react";
import { api, type Album, type AlbumForm, type Video } from "../lib/api";
import { Modal, ModalActions, ConfirmDelete } from "./AdminShows";
import DateInput from "../components/DateInput";

const EMPTY: AlbumForm = { title: "", date: "", folder: "" };
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function generateThumb(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:320px;height:180px;opacity:0;pointer-events:none;";
    document.body.appendChild(video);

    let settled = false;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      if (document.body.contains(video)) document.body.removeChild(video);
    };

    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(blob ? new File([blob], "thumb.jpg", { type: "image/jpeg" }) : null);
    };

    const capture = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = video.videoWidth  || 640;
      canvas.height = video.videoHeight || 360;
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => finish(blob), "image/jpeg", 0.75);
    };

    // Primary: seek to a reliable frame, capture on seeked
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = Math.min(0.5, (video.duration || 2) * 0.1);
    }, { once: true });

    video.addEventListener("seeked", capture, { once: true });

    // Fallback: canplay (fires before seeked in some browsers)
    video.addEventListener("canplay", () => {
      if (!settled) setTimeout(capture, 150);
    }, { once: true });

    video.addEventListener("error", () => finish(null), { once: true });

    // Hard timeout: 12s
    setTimeout(() => finish(null), 12000);

    video.src = url;
  });
}

function youtubeThumb(src: string): string | null {
  const m = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
}

function youtubeEmbed(src: string): string {
  const m = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : src;
}

export default function AdminAlbums() {
  const [albums, setAlbums]         = useState<Album[]>([]);
  const [selected, setSelected]     = useState<Album | null>(null);
  const [tab, setTab]               = useState<"photos" | "videos">("photos");
  const [modal, setModal]           = useState<"new" | Album | null>(null);
  const [form, setForm]             = useState<AlbumForm>(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [videoModal, setVideoModal]   = useState(false);
  const [videoFiles, setVideoFiles]   = useState<File[]>([]);
  const [videoTitle, setVideoTitle]   = useState("");
  const [addingVideo, setAddingVideo] = useState(false);
  const [addProgress, setAddProgress] = useState("");
  const [preview, setPreview]         = useState<Video | null>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  const closePreview = useCallback(() => setPreview(null), []);
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePreview(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, closePreview]);

  async function load() { setAlbums(await api.getAlbums()); }
  useEffect(() => { load(); }, []);

  async function selectAlbum(a: Album) {
    const full = await api.getAlbum(a.id);
    setSelected(full);
  }

  function openNew()          { setForm(EMPTY); setModal("new"); }
  function openEdit(a: Album) { setForm({ title: a.title, date: a.date, folder: a.folder }); setModal(a); }

  async function save() {
    setSaving(true);
    try {
      if (modal === "new") await api.createAlbum(form);
      else await api.updateAlbum((modal as Album).id, form);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    await api.deleteAlbum(id);
    setDeleteId(null);
    if (selected?.id === id) setSelected(null);
    load();
  }

  async function uploadPhotos(albumId: string, files: FileList) {
    setUploading(true);
    await api.uploadPhotos(albumId, files);
    setUploading(false);
    const updated = await api.getAlbum(albumId);
    setSelected(updated);
    load();
  }

  async function deletePhoto(albumId: string, photoId: string) {
    await api.deletePhoto(albumId, photoId);
    const updated = await api.getAlbum(albumId);
    setSelected(updated);
    load();
  }

  async function addVideo() {
    if (!selected || videoFiles.length === 0) return;
    setAddingVideo(true);
    try {
      for (let i = 0; i < videoFiles.length; i++) {
        setAddProgress(`${i + 1}/${videoFiles.length}`);
        const file  = videoFiles[i];
        const thumb = await generateThumb(file);
        await api.addVideo(
          selected.id,
          file,
          thumb ?? undefined,
          videoFiles.length === 1 ? videoTitle.trim() || undefined : undefined,
        );
      }
      const updated = await api.getAlbum(selected.id);
      setSelected(updated);
      load();
      setVideoModal(false);
      setVideoFiles([]);
      setVideoTitle("");
    } finally {
      setAddingVideo(false);
      setAddProgress("");
    }
  }

  async function deleteVideo(albumId: string, videoId: string) {
    await api.deleteVideo(albumId, videoId);
    const updated = await api.getAlbum(albumId);
    setSelected(updated);
    load();
  }

  async function togglePhotoPin(albumId: string, photoId: string, currentPinned: boolean) {
    await api.pinPhoto(albumId, photoId, !currentPinned);
    const updated = await api.getAlbum(albumId);
    setSelected(updated);
  }

  async function toggleVideoPin(albumId: string, videoId: string, currentPinned: boolean) {
    await api.pinVideo(albumId, videoId, !currentPinned);
    const updated = await api.getAlbum(albumId);
    setSelected(updated);
  }

  const Field = ({ label, field, placeholder }: { label: string; field: keyof AlbumForm; placeholder: string }) => (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition" />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Álbuns</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie a galeria de fotos e vídeos</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Álbum
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
          {albums.length === 0
            ? <p className="text-center py-12 text-zinc-600 text-sm bg-[#111] border border-[#2a2a2a] rounded-xl">Nenhum álbum ainda.</p>
            : albums.map((a) => (
              <div key={a.id} onClick={() => selectAlbum(a)}
                className={`bg-[#111] border rounded-xl p-4 cursor-pointer transition-all ${
                  selected?.id === a.id ? "border-red-500/40" : "border-[#2a2a2a] hover:border-zinc-600"
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{a.title}</p>
                    <p className="text-zinc-600 text-xs font-mono mt-0.5">{a.date}</p>
                    <p className="text-zinc-700 text-xs mt-1">
                      {a.photos.length} foto{a.photos.length !== 1 ? "s" : ""} · {a.videos.length} vídeo{a.videos.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(a); }}
                      className="p-1 text-zinc-600 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(a.id); }}
                      className="p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {!selected
            ? <div className="bg-[#111] border border-[#2a2a2a] rounded-xl flex items-center justify-center h-64 text-zinc-700 text-sm">
                Selecione um álbum para gerenciar o conteúdo
              </div>
            : <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#2a2a2a]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">{selected.title}</p>
                      <p className="text-xs text-zinc-600 font-mono">{selected.date}</p>
                    </div>
                    {/* Upload action button */}
                    {tab === "photos" ? (
                      <>
                        <button onClick={() => fileRef.current?.click()} disabled={uploading}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-300 rounded-lg transition-colors disabled:opacity-50">
                          {uploading
                            ? <div className="w-3.5 h-3.5 border border-zinc-500 border-t-transparent rounded-full animate-spin" />
                            : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>}
                          Upload de Fotos
                        </button>
                        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                          onChange={(e) => e.target.files && uploadPhotos(selected.id, e.target.files)} />
                      </>
                    ) : (
                      <button onClick={() => setVideoModal(true)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-300 rounded-lg transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar Vídeo
                      </button>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden w-fit">
                    {(["photos", "videos"] as const).map((t) => (
                      <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                          tab === t ? "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"
                        }`}>
                        {t === "photos"
                          ? `Fotos (${selected.photos.length})`
                          : `Vídeos (${selected.videos.length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {tab === "photos" ? (
                    selected.photos.length === 0
                      ? <p className="text-center text-zinc-700 text-sm py-8">Nenhuma foto. Faça upload acima.</p>
                      : <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {selected.photos.map((ph) => (
                            <div key={ph.id} className="relative group aspect-square rounded-lg overflow-hidden bg-[#0d0d0d]">
                              <img src={`${BASE}${ph.url}`} alt="" className="w-full h-full object-cover" />
                              {/* Pinned badge — always visible */}
                              {ph.pinned && (
                                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center pointer-events-none z-10">
                                  <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M17 4H7a1 1 0 0 0-.7 1.7l3 3V13l-2 4h13l-2-4V8.7l3-3A1 1 0 0 0 17 4zm-5 15-1-2h2l-1 2z"/>
                                  </svg>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => togglePhotoPin(selected.id, ph.id, ph.pinned)}
                                  title={ph.pinned ? "Desafixar" : "Fixar"}
                                  className={`p-1.5 rounded-full text-white transition-colors ${ph.pinned ? "bg-amber-500/80 hover:bg-amber-500" : "bg-zinc-700/80 hover:bg-zinc-600"}`}>
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M17 4H7a1 1 0 0 0-.7 1.7l3 3V13l-2 4h13l-2-4V8.7l3-3A1 1 0 0 0 17 4zm-5 15-1-2h2l-1 2z"/>
                                  </svg>
                                </button>
                                <button onClick={() => deletePhoto(selected.id, ph.id)}
                                  className="p-1.5 bg-red-600/80 rounded-full text-white hover:bg-red-600 transition-colors">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                  ) : (
                    selected.videos.length === 0
                      ? <p className="text-center text-zinc-700 text-sm py-8">Nenhum vídeo. Adicione um acima.</p>
                      : <div className="grid grid-cols-2 gap-3">
                          {selected.videos.map((v) => {
                            const thumb = youtubeThumb(v.src) ?? (v.thumbnail ? `${BASE}${v.thumbnail}` : null);
                            return (
                              <div key={v.id} className="relative group rounded-lg overflow-hidden bg-[#0d0d0d] border border-[#2a2a2a]">
                                {thumb
                                  ? <img src={thumb} alt={v.title ?? ""} className="w-full aspect-video object-cover" />
                                  : <div className="w-full aspect-video flex items-center justify-center bg-zinc-900">
                                      <svg className="w-8 h-8 text-zinc-700" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>}
                                {/* play overlay */}
                                <button onClick={() => setPreview(v)}
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </button>
                                {/* pin button (top-left) */}
                                <button onClick={(e) => { e.stopPropagation(); toggleVideoPin(selected.id, v.id, v.pinned); }}
                                  title={v.pinned ? "Desafixar" : "Fixar"}
                                  className={`absolute top-1.5 left-1.5 p-1 rounded-full transition-all ${
                                    v.pinned
                                      ? "bg-amber-500/80 text-white opacity-100"
                                      : "bg-black/70 text-zinc-400 hover:text-amber-400 opacity-0 group-hover:opacity-100"
                                  }`}>
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M17 4H7a1 1 0 0 0-.7 1.7l3 3V13l-2 4h13l-2-4V8.7l3-3A1 1 0 0 0 17 4zm-5 15-1-2h2l-1 2z"/>
                                  </svg>
                                </button>
                                {/* delete (top-right) */}
                                <button onClick={(e) => { e.stopPropagation(); deleteVideo(selected.id, v.id); }}
                                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 rounded-full text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                                {v.title && (
                                  <p className="px-2 py-1.5 text-xs text-zinc-400 truncate border-t border-[#2a2a2a]">{v.title}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                  )}
                </div>
              </div>}
        </div>
      </div>

      {/* Álbum form modal */}
      {modal !== null && (
        <Modal title={modal === "new" ? "Novo Álbum" : "Editar Álbum"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Título" field="title" placeholder="Rock in Country 2025" />
            <DateInput label="Data" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
            <Field label="Pasta"  field="folder" placeholder="rock-in-country-2025" />
          </div>
          <ModalActions onClose={() => setModal(null)} onSave={save} saving={saving} />
        </Modal>
      )}

      {/* Add video modal */}
      {videoModal && (
        <Modal title="Adicionar Vídeos" onClose={() => { setVideoModal(false); setVideoFiles([]); setVideoTitle(""); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Arquivos de vídeo
                {videoFiles.length > 0 && <span className="ml-2 text-zinc-400 normal-case">{videoFiles.length} selecionado{videoFiles.length !== 1 ? "s" : ""}</span>}
              </label>

              {/* File list */}
              {videoFiles.length > 0 && (
                <div className="space-y-1 mb-2 max-h-40 overflow-y-auto">
                  {videoFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2">
                      <svg className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <span className="text-sm text-zinc-300 truncate flex-1">{f.name}</span>
                      <button type="button" onClick={() => setVideoFiles((prev) => prev.filter((_, j) => j !== i))}
                        className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" onClick={() => videoFileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {videoFiles.length === 0 ? "Escolher arquivos" : "Adicionar mais"}
              </button>
              <input ref={videoFileRef} type="file" accept="video/*" multiple className="hidden"
                onChange={(e) => {
                  const picked = e.target.files ? Array.from(e.target.files) : [];
                  e.target.value = "";
                  if (picked.length > 0) setVideoFiles((prev) => [...prev, ...picked]);
                }} />
              <p className="text-xs text-zinc-700 mt-1">MP4, MOV, AVI, MKV… — pode selecionar vários de uma vez</p>
            </div>

            {videoFiles.length === 1 && (
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Título (opcional)</label>
                <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Show ao vivo — São Paulo 2024"
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition" />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#222]">
            <button onClick={() => { setVideoModal(false); setVideoFiles([]); setVideoTitle(""); }}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white bg-[#0d0d0d] hover:bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] transition-colors">
              Cancelar
            </button>
            <button onClick={addVideo} disabled={addingVideo || videoFiles.length === 0}
              className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors">
              {addingVideo ? `Enviando ${addProgress}…` : `Adicionar${videoFiles.length > 1 ? ` (${videoFiles.length})` : ""}`}
            </button>
          </div>
        </Modal>
      )}

      {/* Video preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closePreview(); }}>
          <button onClick={closePreview} aria-label="Fechar"
            className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
            </svg>
          </button>
          <div className="w-full max-w-4xl">
            {preview.title && <p className="text-white font-medium mb-3 text-center">{preview.title}</p>}
            <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
              {youtubeThumb(preview.src)
                ? <iframe src={youtubeEmbed(preview.src)} className="w-full h-full" allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                : <video src={`${BASE}${preview.src}`} controls autoPlay className="w-full h-full" />}
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={() => remove(deleteId)}
          message="Excluir este álbum? Todas as fotos e vídeos serão removidos." />
      )}
    </div>
  );
}
