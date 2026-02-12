import PlatformHeader from "@/components/_platform/platform-header";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Palette, SquareDashedMousePointer } from "lucide-react";

const RealtimeCanvasFeatures = [
  {
    id: 51,
    title: "Designed for Architecture & System Thinking",
    description:
      "Map out service interactions, API flows, and database relationships with intuitive drawing tools. Create structured diagrams that reflect how your repository is actually built — not abstract sketches disconnected from your code.",
    image: "/assets/vectors/architecture-diagram.svg",
    icon: SquareDashedMousePointer,
  },
  {
    id: 52,
    title: "Integrated with Your Lab",
    description:
      "Every canvas lives inside a lab, tied directly to your repository and collaborators. Discussions, diagrams, and AI insights stay organized within the same structured environment.",
    image: "/assets/vectors/lab-integration.svg",
    icon: FlaskConical,
  },
];

export const Route = createFileRoute("/_pathlessLayout/realtime-canvas")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="w-full px-24 relative">
        <div className="w-full flex flex-col justify-start items-center border-x border-dashed border-neutral-700">
          <PlatformHeader
            title="Realtime Canvas — Visual Collaboration, Built for Developers"
            description="Realtime Canvas brings structured visual thinking into your workflow. Design architecture, map system flows, and collaborate live with your team — all within the same workspace connected to your repositories."
            image="/assets/vectors/realtime-canvas-content.svg"
          />

          {/* LIVE COLLAB SECTION */}
          <div className="w-full border-t border-dashed border-neutral-700 py-20 px-24">
            <div className="w-full">
              <Badge
                variant="free"
                className="py-1 px-3 text-md text-neutral-200 mb-4"
              >
                Live Multi-User Collaboration
              </Badge>

              <p className="text-xl text-neutral-500 mb-10">
                Work alongside your teammates in real time with synchronized
                cursors and instant updates. Every movement, annotation, and
                diagram evolves live — eliminating the disconnect between
                discussion and documentation.
              </p>
              <img
                src="/assets/vectors/canvasid25.svg"
                alt="Canvas Demo"
                className="mx-auto"
              />
            </div>
          </div>

          {/* SPLIT FEATURE SECTION */}
          <div className="w-full grid grid-cols-2 border-t border-dashed border-neutral-700">
            {RealtimeCanvasFeatures.map((feature) => (
              <div className="p-10 px-24 border-r border-dashed border-neutral-700 space-y-3">
                <feature.icon className="w-8 h-8 text-neutral-200" />
                <p className="text-neutral-200 text-xl font-semibold">
                  {feature.title}
                </p>

                <p className="text-neutral-500 text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CLOSING STATEMENT */}
          <div className="w-full border-t border-dashed border-neutral-700 px-24 py-10 space-y-3">
            <Palette className="h-8 w-8 text-neutral-200" />
            <p className="text-2xl text-neutral-500">
              <span className="text-neutral-200">
                Realtime Canvas bridges the gap between code and collaboration.
              </span>{" "}
              Instead of switching between tools, teams can design, discuss, and
              refine architecture within the same ecosystem — preserving clarity
              as projects evolve.
            </p>
          </div>

          <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
        </div>
      </div>
    </div>
  );
}
