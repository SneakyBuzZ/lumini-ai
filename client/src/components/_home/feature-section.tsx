const features = [
  {
    title: "Repo Whisperer",
    description:
      "Query your entire GitHub codebase using natural language. Lumini understands project structure, context, and relationships between files.",
    icon: "/assets/icons/repo-whisperer.svg",
    contentImage: "/assets/vectors/repo-whisperer-content.svg",
    borderClassName: "border-x border-dashed border-neutral-700",
  },
  {
    title: "Real Time Canvas",
    description:
      "Visualize your codebase with a finite canvas. Invite teammates to explore architecture together, share insights, and collaborate in real-time.",
    icon: "/assets/icons/realtime-canvas.svg",
    contentImage: "/assets/vectors/realtime-canvas-content.svg",
    borderClassName: "border-r border-dashed border-neutral-700",
  },
  {
    title: "Collaborative Workspaces",
    description:
      "Invite teammates into structured workspaces. Share insights, explore architecture together, and collaborate in real-time.",
    icon: "/assets/icons/collab-workspace.svg",
    contentImage: "/assets/vectors/collab-workspace-content.svg",
    borderClassName:
      "border-l border-x border-t border-dashed border-neutral-700",
  },
  {
    title: "Insightful Dashboard",
    description:
      "Get a high-level overview of your codebase with Lumini's insightful dashboard. Understand architecture, dependencies, and key metrics at a glance.",
    icon: "/assets/icons/insightful-dashboard.svg",
    contentImage: "/assets/vectors/insightful-dashboard-content.svg",
    borderClassName: "border-r border-t border-dashed border-neutral-700",
  },
];

export default function FeatureSection() {
  return (
    <div className="w-full relative px-24 grid grid-cols-2">
      {features.map((feature, index) => (
        <article
          key={index}
          className={`flex justify-center items-center gap-6 p-20 ${feature.borderClassName}`}
        >
          <div className="flex flex-col justify-start items-start gap-1">
            <img
              src={feature.icon}
              alt={feature.title}
              className="mb-2 h-6 w-6"
            />
            <h3 className="text-lg font-semibold text-neutral-200 tracking-tight font-manrope">
              {feature.title}
            </h3>

            <p className="text-md tracking-tight font-extralight text-neutral-400">
              {feature.description}
            </p>
          </div>
          <img
            src={feature.contentImage}
            alt={feature.title}
            className="w-60"
          />
        </article>
      ))}
      <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
    </div>
  );
}
