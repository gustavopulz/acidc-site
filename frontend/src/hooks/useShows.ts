import { useState, useEffect } from "react";
import type { ShowInfo } from "../components/ShowCard";
import { shows as staticShows } from "../data/shows";

function parseShowDate(dateStr: string): Date {
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (!m) return new Date(0);
  const [, d, mo, y, h = "00", mi = "00"] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi));
}

function sortByDate(arr: ShowInfo[]) {
  return [...arr].sort((a, b) => parseShowDate(a.date).getTime() - parseShowDate(b.date).getTime());
}

export function useShows() {
  const [shows, setShows] = useState<ShowInfo[]>(sortByDate(staticShows));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) return;

    setLoading(true);
    fetch(`${apiUrl}/api/shows`)
      .then((r) => r.json())
      .then((data: ShowInfo[]) => { if (Array.isArray(data)) setShows(sortByDate(data)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { shows, loading };
}
