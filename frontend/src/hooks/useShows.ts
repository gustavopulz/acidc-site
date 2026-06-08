import { useState, useEffect } from "react";
import type { ShowInfo } from "../components/ShowCard";
import { shows as staticShows } from "../data/shows";

export function useShows() {
  const [shows, setShows] = useState<ShowInfo[]>(staticShows);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) return;

    setLoading(true);
    fetch(`${apiUrl}/api/shows`)
      .then((r) => r.json())
      .then((data: ShowInfo[]) => { if (Array.isArray(data)) setShows(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { shows, loading };
}
