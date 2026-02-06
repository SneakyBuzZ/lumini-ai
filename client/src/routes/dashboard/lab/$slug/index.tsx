import FilesCard from "@/components/_lab/dashboard/files-card";
import { LanguageCompositionCard } from "@/components/_lab/dashboard/language-card";
import OverviewCard from "@/components/_lab/dashboard/overview-card";
import Loading from "@/components/shared/loading";
import { GetOverviewResponse } from "@/lib/api/dto";
import { getOverview } from "@/lib/api/lab-api";
import { delay } from "@/utils/delay";
import { createFileRoute } from "@tanstack/react-router";
import { Github } from "lucide-react";

export const Route = createFileRoute("/dashboard/lab/$slug/")({
  loader: async ({ context, params }) => {
    const response = await context.queryClient.ensureQueryData({
      queryKey: ["lab", params.slug, "dashboard", "overview"],
      queryFn: () => getOverview(params.slug),
    });
    await delay(1000);
    return { data: response };
  },
  pendingComponent: Loading,
  component: RouteComponent,
});

function RouteComponent() {
  // const { data } = Route.useLoaderData();

  const data: GetOverviewResponse = {
    fullname: "sneakybuzz/patron",
    branch: "main",
    architecture: [
      { name: "src", percentage: 75 },
      { name: "lib", percentage: 30 },
      { name: "controllers", percentage: 28 },
      { name: "routes", percentage: 12 },
    ],
    languages: [
      { name: "TypeScript", percentage: 70 },
      { name: "Solidity", percentage: 30 },
      { name: "JavaScript", percentage: 10 },
    ],
    files: 120,
    sizeKb: "2048",
    lastActivityAt: "2024-06-15T12:34:56Z",
    scope: "Public",
    repoCreatedAt: "2023-01-10T09:00:00Z",
    summary:
      "Patron is a decentralized subscription platform built on Ethereum, enabling content creators to monetize their work through crypto payments. It offers features like tiered memberships, exclusive content access, ..",
    techstack: [
      "TypeScript",
      "Solidity",
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
    ],
    totalBytes: 5000000,
    visibility: "public",
  };

  return (
    <div className="bg-midnight-300/70 w-full h-full p-5">
      <div className="w-full flex flex-col items-start justify-center gap-4">
        <div className="flex justify-start items-center gap-2.5 z-10">
          <div className="bg-gradient-to-br from-teal/30 to-cyan/10 p-2 rounded-full border border-neutral-700/50">
            <Github className="size-7 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-neutral-500">Repository</span>
            <span className="text-lg text-neutral-200 font-mono font-semibold leading-[20px]">
              {data.fullname}
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full z-20 h-[19rem]">
          <OverviewCard {...data} />
          <LanguageCompositionCard languages={data.languages} />
          <FilesCard
            architecture={data.architecture}
            files={data.files}
            sizeKb={data.sizeKb}
            lastActivityAt={data.lastActivityAt}
            scope={data.scope}
          />
        </div>
        <DummyCommits />
      </div>
    </div>
  );
}

function DummyCommits() {
  const commits = [
    {
      sha: "a1b2c3d",
      message: "Refactor canvas selection logic",
      author: "Kaushik",
      avatar: "https://avatars.githubusercontent.com/u/151988073?v=4",
      time: "2 hours ago",
    },
    {
      sha: "e4f5g6h",
      message: "Add workspace invite flow",
      author: "Kaushik",
      avatar: "https://avatars.githubusercontent.com/u/151988073?v=4",
      time: "1 day ago",
    },
    {
      sha: "i7j8k9l",
      message: "Improve vector DB indexing",
      author: "Kaushik",
      avatar: "https://avatars.githubusercontent.com/u/151988073?v=4",
      time: "3 days ago",
    },
  ];

  return (
    <div className="w-full bg-midnight-200/60 border border-neutral-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-200">
          Recent Commits
        </h3>
        <span className="text-xs text-neutral-500">Last 7 days</span>
      </div>

      {/* Commit list */}
      <ul className="flex flex-col">
        {commits.map((commit, index) => (
          <li
            key={commit.sha}
            className={[
              "flex items-center justify-between gap-4 px-3 py-3",
              "hover:bg-midnight-100/40 transition-colors rounded-lg",
              index !== commits.length - 1
                ? "border-b border-neutral-800/60"
                : "",
            ].join(" ")}
          >
            {/* Left: avatar + text */}
            <div className="flex items-start gap-3">
              <img
                src={commit.avatar}
                alt={commit.author}
                className="h-8 w-8 rounded-full border border-neutral-700 bg-midnight-300"
              />

              <div className="flex flex-col">
                <span className="text-sm text-neutral-200 leading-snug">
                  {commit.message}
                </span>
                <span className="text-xs text-neutral-500">
                  {commit.author} · {commit.time}
                </span>
              </div>
            </div>

            {/* Right: SHA */}
            <span className="shrink-0 text-xs font-mono text-neutral-400 bg-midnight-100/60 border border-neutral-700 rounded-md px-2 py-1">
              {commit.sha}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
