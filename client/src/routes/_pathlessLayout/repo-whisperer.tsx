import PlatformHeader from "@/components/_platform/platform-header";
import PlatformImage from "@/components/_platform/platform-image";
import { Badge } from "@/components/ui/badge";
import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, FolderArchive, Package, Volleyball } from "lucide-react";

const RepoWhispererFeatures = [
  {
    id: 31,
    title: "Intelligent Retrieval",
    description:
      "Automatically fetches the most relevant files and code blocks before generating answers.",
    icon: <BrainCircuit size={24} />,
  },
  {
    id: 32,
    title: "Cross-File Traceability",
    description:
      "Follows execution paths across modules to understand how logic connects.",
    icon: <Package size={24} />,
  },
  {
    id: 33,
    title: "Architecture Mapping",
    description:
      "Understands dependencies and structural patterns within your repository.",
    icon: <FolderArchive size={24} />,
  },
  {
    id: 34,
    title: "Context-Preserved Threads",
    description:
      "Keeps track of repository-level context across follow-up questions.",
    icon: <Volleyball size={24} />,
  },
];

export const Route = createFileRoute("/_pathlessLayout/repo-whisperer")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="w-full px-24 relative">
        <div className=" w-full flex flex-col justify-start items-center border-x border-dashed border-neutral-700">
          <PlatformHeader
            title="Repo Whisperer — Understand Your Codebase Through Contextual AI"
            description="Repo Whisperer connects directly to your GitHub repository and builds a contextual understanding of your codebase. Instead of generic AI answers, it retrieves relevant files, functions, and dependencies in real time — so every response is grounded in your actual project structure."
            image="/assets/vectors/repo-whisperer-content.svg"
          />
          <PlatformImage />
          <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
        </div>
      </div>
      <div className="w-full px-24 relative">
        <div className="w-full grid grid-cols-2 border-x border-dashed border-neutral-700">
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-start items-start gap-3 px-14 p-10 border-r border-dashed border-neutral-700">
            <Badge variant={"free"} className="py-1 px-3  text-neutral-200">
              Repository Intelligence
            </Badge>

            <p className="text-lg text-neutral-500 mb-4">
              Repo Whisperer builds a structured understanding of your
              repository — indexing files, analyzing dependencies, and mapping
              relationships between modules. Every response is grounded in your
              actual project, not generic assumptions.
            </p>

            <img
              src="/assets/vectors/repoid25.svg"
              alt="Repo Whisperer Content"
              className="w-full"
            />
          </div>

          {/* RIGHT GRID FEATURES */}
          <div className="grid grid-cols-2">
            {RepoWhispererFeatures.map((feature) => (
              <div className="text-neutral-500 p-6 border border-neutral-800 flex flex-col gap-3">
                {feature.icon}
                <p className="text-lg leading-tight">
                  <span className="text-neutral-200 font-semibold">
                    {feature.title}
                  </span>{" "}
                  {feature.description}
                  blocks before generating answers.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
