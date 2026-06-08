import { useState, useEffect } from "react";

export interface ApiPhoto { id: string; url: string; pinned: boolean }
export interface ApiVideo { id: string; src: string; title?: string; pinned: boolean }
export interface ApiAlbum {
  id: string; title: string; date: string; folder: string;
  photos: ApiPhoto[]; videos: ApiVideo[];
}

const BASE = import.meta.env.VITE_API_URL ?? "";

export function useAlbums() {
  const [albums, setAlbums] = useState<ApiAlbum[]>([]);
  const [loading, setLoading] = useState(!!BASE);

  useEffect(() => {
    if (!BASE) { setLoading(false); return; }
    fetch(`${BASE}/api/albums`)
      .then((r) => r.json())
      .then((data: ApiAlbum[]) => { if (Array.isArray(data)) setAlbums(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { albums, loading };
}
