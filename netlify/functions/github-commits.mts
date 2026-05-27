import type { Context } from "@netlify/functions";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "UlissesMolina";

const headers = { "Content-Type": "application/json" };
const gh = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

interface Commit {
  repo: string;
  message: string;
  timestamp: string;
}

export default async (_req: Request, _context: Context) => {
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ commits: [] }), { headers });
  }

  try {
    // get most recently pushed repos
    const reposRes = await gh(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5&type=owner`
    );
    if (!reposRes.ok) {
      return new Response(JSON.stringify({ commits: [] }), { headers });
    }
    const repos: { full_name: string; name: string }[] = await reposRes.json();

    // fetch latest commit from each repo in parallel
    const allCommits: Commit[] = [];
    const results = await Promise.all(
      repos.map(async (repo) => {
        const res = await gh(
          `https://api.github.com/repos/${repo.full_name}/commits?per_page=3`
        );
        if (!res.ok) return [];
        const commits: {
          commit: { message: string; author: { date: string } };
        }[] = await res.json();
        return commits.map((c) => ({
          repo: repo.name,
          message: c.commit.message.split("\n")[0],
          timestamp: c.commit.author.date,
        }));
      })
    );

    for (const repoCommits of results) {
      allCommits.push(...repoCommits);
    }

    // sort by most recent and take top 3
    allCommits.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return new Response(
      JSON.stringify({ commits: allCommits.slice(0, 3) }),
      { headers }
    );
  } catch {
    return new Response(JSON.stringify({ commits: [] }), { headers });
  }
};
