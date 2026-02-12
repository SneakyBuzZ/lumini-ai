import PlatformHeader from "@/components/_platform/platform-header";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

const CollabWorkflow = [
  {
    id: 1,
    title: "Create a Workspace",
    description:
      "A workspace acts as the foundation for your team. Create labs within them, invite members, and centralize shared context. Workspaces keep your team aligned without forcing rigid processes. Its flexible structure adapts to your workflow — whether you prefer a single workspace for everything or multiple workspaces for different projects.",
    image: "/assets/vectors/create-workspace.svg",
  },
  {
    id: 2,
    title: "Spin Up Labs",
    description:
      "Create dedicated labs within the workspace for specific features, refactors, or experiments without interfering with parallel efforts. Each is attached with a Github Repository and comes with its own AI assistant, so teams can collaborate in context without stepping on each other's work.",
    image: "/assets/vectors/create-lab.svg",
  },
  {
    id: 3,
    title: "Assign Roles & Collaborate",
    description:
      "Control access with role-based permissions while collaborating in real time through AI assistance and shared canvases. work. Collab Space keeps everyone aligned and moving forward without creating bottlenecks. A member can be an Admin , Developer or Moderator — each with different permissions to manage workspaces, labs, and discussions.",
    image: "/assets/vectors/invite-member.svg",
  },
];

export const Route = createFileRoute("/_pathlessLayout/collab-space")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="w-full px-24 relative">
        <div className="w-full flex flex-col justify-start items-center border-x border-dashed border-neutral-700">
          <PlatformHeader
            title="Collab Space — Structured Workspaces Built for Teams"
            description="Collab Space introduces a hierarchical collaboration model for modern development teams. Organize members, repositories, and discussions inside structured workspaces — and create focused labs for features, experiments, or architectural initiatives."
            image="/assets/vectors/collab-workspace-content.svg"
          />

          {/* HOW IT WORKS - Vertical Flow */}
          <div className="w-full border-dashed border-neutral-700">
            <div className="px-24 py-10">
              <Badge variant="free" className="py-1 px-3 mb-4 text-neutral-200">
                How Collab Space Works
              </Badge>

              <p className="text-xl text-neutral-200 leading-relaxed">
                Collaboration in Lumini follows a clear structure. Every team
                operates within a workspace, and every initiative lives inside a
                lab — ensuring clarity as projects scale.
              </p>
            </div>

            <ul className="flex flex-col gap-16 w-full">
              {CollabWorkflow.map((step) => (
                <li className=" w-full flex justify-between items-start gap-12 border-t border-dashed border-neutral-700 px-24 py-10">
                  <img src={step.image} alt={step.title} className="w-80" />
                  <div className="flex flex-col justify-center items-start gap-1">
                    <p className="text-neutral-200 text-3xl font-semibold">
                      {step.title}
                    </p>
                    <p className="text-neutral-500 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* WHY STRUCTURE MATTERS */}
          <div className="w-full border-t border-dashed border-neutral-700 py-20 px-32">
            <div className="w-full">
              <p className="text-2xl text-neutral-500 leading-relaxed">
                <span className="text-neutral-100">
                  As repositories grow and teams expand, unstructured
                  collaboration creates friction.
                </span>{" "}
                Context becomes scattered, conversations fragment, and
                architectural decisions drift. Collab Space restores alignment
                by introducing intentional hierarchy — keeping work organized
                without slowing teams down.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
        </div>
      </div>
    </div>
  );
}
