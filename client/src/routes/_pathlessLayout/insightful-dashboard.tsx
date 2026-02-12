import PlatformHeader from "@/components/_platform/platform-header";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { FormInput, GitGraph, Activity } from "lucide-react";

const InsightBlocks = [
  {
    id: 1,
    title: "Structural Overview",
    description:
      "Visualize how your repository is organized — directories, modules, and dependencies — to quickly understand boundaries and system design at a glance.",
    icon: FormInput,
  },
  {
    id: 2,
    title: "Commit & Change Tracking",
    description:
      "Explore commit history and diff changes with filtering by author, branch, or timeframe — helping you understand when and why modifications occurred.",
    icon: GitGraph,
  },
  {
    id: 3,
    title: "Dependency & Activity Insights",
    description:
      "Identify active areas of development, tightly coupled modules, and evolving components to reduce blind spots in large-scale projects.",
    icon: Activity,
  },
];

export const Route = createFileRoute("/_pathlessLayout/insightful-dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="w-full px-24 relative">
        <div className="w-full flex flex-col justify-start items-center border-x border-dashed border-neutral-700">
          <PlatformHeader
            title="Insightful Dashboard — Visibility Into Every Layer of Your Codebase"
            description="The Insightful Dashboard provides a structured overview of your repository — from file organization and dependency relationships to commit activity and change tracking. Understand how your system evolves without manually piecing context together."
            image="/assets/vectors/insightful-dashboard-content.svg"
          />

          {/* OVERVIEW SECTION */}
          <div className="w-full border-t border-dashed border-neutral-700 py-20 px-24">
            <div className="w-full">
              <Badge
                variant="free"
                className="py-1 px-3 text-md mb-4 text-neutral-200"
              >
                Repository-Level Intelligence
              </Badge>

              <p className="text-xl text-neutral-500 mb-8">
                Large repositories are difficult to reason about without
                structural visibility. The Insightful Dashboard surfaces the
                relationships, changes, and patterns that shape your codebase —
                giving teams a clear foundation for informed decisions.
              </p>
              <img
                src="/assets/vectors/insightid25.svg"
                alt="Insights"
                className="w-full"
              />
            </div>
          </div>

          {/* INSIGHT BLOCKS */}
          <div className="w-full border-t border-dashed border-neutral-700 grid grid-cols-3 gap-10 px-24">
            {InsightBlocks.map((block) => (
              <div className="py-10 border-b border-dashed border-neutral-700">
                <block.icon className="w-6 h-6 text-neutral-400 mb-3" />
                <p className="text-neutral-200 font-semibold mb-3">
                  {block.title}
                </p>
                <p className="text-neutral-500 leading-relaxed max-w-3xl">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
        </div>
      </div>
    </div>
  );
}
