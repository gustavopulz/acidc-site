import { useEffect, useState, useRef } from "react";
import { api, type Album, type AlbumForm } from "../lib/api";
import { Modal, ModalActions, ConfirmDelete } from "./AdminShows";

const EMPTY: AlbumForm = { title: "", date: "", folder: "" };
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export default function AdminAlbums() {
  const [albums, setAlbums]     = useState<Album[]>([]);
  const [selected, setSelected] = useState<Album | null>(null);
  const [modal, setModal]       = useState<"new" | Album | null>(null);
  const [form, setForm]         = useState<AlbumForm>(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() { setAlbums(await api.getAlbums()); }
  useEffect(() => { load(); }, []);

  function openNew()           { setForm(EMPTY); setModal("new"); }
  function openEdit(a: Album)  { setForm({ title: a.title, date: a.date, folder: a.folder }); setModal(a); }

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

  const Field = ({ label, field, placeholder }: { label: string; field: keyof AlbumForm; placeholder: string }) => (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition" />
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
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
              <div key={a.id} onClick={() => setSelected(a)}
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
                Selecione um álbum para gerenciar as fotos
              </div>
            : <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{selected.title}</p>
                    <p className="text-xs text-zinc-600 font-mono">{selected.date}</p>
                  </div>
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
                </div>
                <div className="p-5">
                  {selected.photos.length === 0
                    ? <p className="text-center text-zinc-700 text-sm py-8">Nenhuma foto. Faça upload acima.</p>
                    : <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {selected.photos.map((ph) => (
                          <div key={ph.id} className="relative group aspect-square rounded-lg overflow-hidden bg-[#0d0d0d]">
                            <img src={`${BASE}${ph.url}`} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => deletePhoto(selected.id, ph.id)}
                                className="p-1.5 bg-red-600/80 rounded-full text-white hover:bg-red-600 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>}
                </div>
              </div>}
        </div>
      </div>

      {modal !== null && (
        <Modal title={modal === "new" ? "Novo Álbum" : "Editar Álbum"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Título" field="title" placeholder="Rock in Country 2025" />
            <Field label="Data"   field="date"  placeholder="dd/mm/aaaa" />
            <Field label="Pasta"  field="folder" placeholder="rock-in-country-2025" />
          </div>
          <ModalActions onClose={() => setModal(null)} onSave={save} saving={saving} />
        </Modal>
      )}

      {deleteId && (
        <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={() => remove(deleteId)}
          message="Excluir este álbum? Todas as fotos serão removidas." />
      )}
    </div>
  );
}
