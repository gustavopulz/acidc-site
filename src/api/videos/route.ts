// app/api/videos/route.ts
export const runtime = "edge"; // ou "nodejs", se preferir

export async function GET() {
  try {
    const channelId = "UCbYAtAl3uGzFQwS42T0A5pw";
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(rssUrl);
    if (!res.ok) {
      return Response.json(
        { error: "Erro ao buscar feed" },
        { status: res.status }
      );
    }

    const xml = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");

    const entries = Array.from(doc.querySelectorAll("entry")).map((entry) => ({
      id: entry.querySelector("yt\\:videoId")?.textContent ?? "",
      title: entry.querySelector("title")?.textContent ?? "",
      thumbnail:
        entry.querySelector("media\\:thumbnail")?.getAttribute("url") ??
        "https://i.ytimg.com/vi/default.jpg",
    }));

    return Response.json(entries);
  } catch (err) {
    console.error("Erro ao processar feed:", err);
    return Response.json(
      { error: "Erro interno ao processar feed" },
      { status: 500 }
    );
  }
}
