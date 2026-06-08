const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function token() {
  return localStorage.getItem("adminToken") ?? "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  };
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Erro desconhecido");
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ token: string; name: string; email: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiFetch<{ id: string; name: string; email: string }>("/api/auth/me"),

  // Shows
  getShows: (all = false) => apiFetch<Show[]>(`/api/shows${all ? "?all=true" : ""}`),
  createShow: (data: ShowForm) =>
    apiFetch<Show>("/api/shows", { method: "POST", body: JSON.stringify(data) }),
  updateShow: (id: string, data: ShowForm) =>
    apiFetch<Show>(`/api/shows/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteShow: (id: string) =>
    apiFetch(`/api/shows/${id}`, { method: "DELETE" }),

  // Albums
  getAlbums: () => apiFetch<Album[]>("/api/albums"),
  getAlbum: (id: string) => apiFetch<Album>(`/api/albums/${id}`),
  createAlbum: (data: AlbumForm) =>
    apiFetch<Album>("/api/albums", { method: "POST", body: JSON.stringify(data) }),
  updateAlbum: (id: string, data: AlbumForm) =>
    apiFetch<Album>(`/api/albums/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAlbum: (id: string) =>
    apiFetch(`/api/albums/${id}`, { method: "DELETE" }),
  uploadPhotos: (albumId: string, files: FileList, pinned = false) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    fd.append("pinned", String(pinned));
    return fetch(`${BASE}/api/albums/${albumId}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: fd,
    }).then((r) => r.json());
  },
  deletePhoto: (albumId: string, photoId: string) =>
    apiFetch(`/api/albums/${albumId}/photos`, {
      method: "DELETE",
      body: JSON.stringify({ photoId }),
    }),
  pinPhoto: (albumId: string, photoId: string, pinned: boolean) =>
    apiFetch(`/api/albums/${albumId}/photos`, {
      method: "PATCH",
      body: JSON.stringify({ photoId, pinned }),
    }),
  addVideo: (albumId: string, file: File, thumbnail?: File, title?: string): Promise<Video> => {
    const fd = new FormData();
    fd.append("file", file);
    if (thumbnail) fd.append("thumbnail", thumbnail);
    if (title) fd.append("title", title);
    return fetch(`${BASE}/api/albums/${albumId}/videos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: fd,
    }).then((r) => {
      if (!r.ok) throw new Error("Erro ao enviar vídeo");
      return r.json() as Promise<Video>;
    });
  },
  deleteVideo: (albumId: string, videoId: string) =>
    apiFetch(`/api/albums/${albumId}/videos`, {
      method: "DELETE",
      body: JSON.stringify({ videoId }),
    }),
  pinVideo: (albumId: string, videoId: string, pinned: boolean) =>
    apiFetch(`/api/albums/${albumId}/videos`, {
      method: "PATCH",
      body: JSON.stringify({ videoId, pinned }),
    }),

  // News
  getNews: (all = false) => apiFetch<NewsItem[]>(`/api/news${all ? "?all=true" : ""}`),
  getNewsItem: (id: string) => apiFetch<NewsDetail>(`/api/news/${id}`),
  createNews: (data: NewsForm) =>
    apiFetch<NewsDetail>("/api/news", { method: "POST", body: JSON.stringify(data) }),
  updateNews: (id: string, data: NewsForm) =>
    apiFetch<NewsDetail>(`/api/news/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteNews: (id: string) =>
    apiFetch(`/api/news/${id}`, { method: "DELETE" }),

  // Analytics
  getAnalytics: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to)   params.set("to", to);
    return apiFetch<Analytics>(`/api/analytics?${params}`);
  },
};

// Types
export interface Show {
  id: string; date: string; city: string; venue: string; status?: string; link?: string; active: boolean;
}
export interface ShowForm {
  date: string; city: string; venue: string; status?: string; link?: string;
}

export interface Photo { id: string; url: string; pinned: boolean }
export interface Video { id: string; src: string; thumbnail?: string; title?: string; pinned: boolean }
export interface Album {
  id: string; title: string; date: string; folder: string;
  photos: Photo[]; videos: Video[];
}
export interface AlbumForm { title: string; date: string; folder: string }

export interface NewsItem {
  id: string; title: string; slug: string; excerpt?: string;
  coverImage?: string; published: boolean; createdAt: string;
}
export interface NewsDetail extends NewsItem { content: string }
export interface NewsForm {
  title: string; slug: string; content: string;
  excerpt?: string; coverImage?: string; published?: boolean;
}

export interface Analytics {
  total: number; today: number; thisWeek: number; thisMonth: number;
  dailySeries: { date: string; count: number }[];
  topPages:    { page: string; count: number }[];
}
