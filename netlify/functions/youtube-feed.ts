import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

export const handler: Handler = async (event) => {
  try {
    const channelId = event.queryStringParameters?.channelId;
    if (!channelId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing channelId" }),
      };
    }
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
      channelId
    )}`;
    const res = await fetch(url);
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: `Upstream error ${res.status}` }),
      };
    }
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml);
    const entries = json?.feed?.entry || [];
    const items = entries.map((e: any) => {
      const id = e["yt:videoId"]; // string
      const title = e.title;
      const thumb = e["media:group"]?.["media:thumbnail"]?.["@_url"];
      const publishedAt = e.published;
      return {
        id,
        title,
        thumbnail: thumb,
        publishedAt,
      };
    });
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        // Allow browser calls from site origin
        "access-control-allow-origin": "*",
      },
      body: JSON.stringify({ items }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e?.message || "Server error" }),
    };
  }
};
