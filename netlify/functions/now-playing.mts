import type { Context } from "@netlify/functions";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=3";

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

    // fetch currently playing and recently played in parallel
    const [nowRes, recentRes] = await Promise.all([
      fetch(NOW_PLAYING_URL, { headers: auth }),
      fetch(RECENTLY_PLAYED_URL, { headers: auth }),
    ]);

    // parse recent tracks
    const recentTracks: { track: string; artist: string; albumArt?: string }[] = [];
    if (recentRes.status === 200) {
      const recentData = await recentRes.json();
      for (const entry of recentData.items ?? []) {
        const t = entry.track;
        if (t) {
          recentTracks.push({
            track: t.name,
            artist: t.artists.map((a: { name: string }) => a.name).join(", "),
            albumArt: t.album?.images?.[0]?.url ?? undefined,
          });
        }
      }
    }

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
            albumArt: data.item.album?.images?.[0]?.url ?? null,
            spotifyUrl: data.item.external_urls?.spotify ?? null,
            progressMs: data.progress_ms,
            durationMs: data.item.duration_ms,
            recentTracks,
          }),
          { headers }
        );
      }
    }

    // not playing — use first recent track as lastTrack
    const lastItem = recentTracks[0];
    return new Response(
      JSON.stringify({
        isPlaying: false,
        lastTrack: lastItem?.track,
        lastArtist: lastItem?.artist,
        recentTracks,
      }),
      { headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ isPlaying: false }),
      { headers }
    );
  }
};
