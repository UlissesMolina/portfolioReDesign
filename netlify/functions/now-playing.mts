import type { Context } from "@netlify/functions";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const headers = { "Content-Type": "application/json" };

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export default async (_req: Request, _context: Context) => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return new Response(
      JSON.stringify({ isPlaying: false }),
      { headers }
    );
  }

  try {
    const token = await getAccessToken();
    const auth = { Authorization: `Bearer ${token}` };

    // try currently playing
    const nowRes = await fetch(NOW_PLAYING_URL, { headers: auth });

    if (nowRes.status === 200) {
      const data = await nowRes.json();

      if (data.is_playing && data.item) {
        return new Response(
          JSON.stringify({
            isPlaying: true,
            track: data.item.name,
            artist: data.item.artists
              .map((a: { name: string }) => a.name)
              .join(", "),
            progressMs: data.progress_ms,
            durationMs: data.item.duration_ms,
          }),
          { headers }
        );
      }
    }

    // not playing — get last played track
    const recentRes = await fetch(RECENTLY_PLAYED_URL, { headers: auth });

    if (recentRes.status === 200) {
      const recentData = await recentRes.json();
      const item = recentData.items?.[0]?.track;

      if (item) {
        return new Response(
          JSON.stringify({
            isPlaying: false,
            lastTrack: item.name,
            lastArtist: item.artists
              .map((a: { name: string }) => a.name)
              .join(", "),
          }),
          { headers }
        );
      }
    }

    return new Response(
      JSON.stringify({ isPlaying: false }),
      { headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ isPlaying: false }),
      { headers }
    );
  }
};
