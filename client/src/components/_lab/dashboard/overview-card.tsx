import { Badge } from "@/components/ui/badge";

interface OverviewCardProps {
  summary: string;
  branch: string;
  visibility: "public" | "private";
  techstack: string[];
  files: number;
  sizeKb: string;
  lastActivityAt: string;
  scope: string;
}

export default function OverviewCard(data: OverviewCardProps) {
  const pickBadgeColor = (index: number) => {
    const badgeColors = [
      "text-cyan-400",
      "text-yellow-400",
      "text-violet-400",
      "text-pink-400",
      "text-green-400",
      "text-orange-400",
    ];
    return badgeColors[index % badgeColors.length];
  };
  return (
    <div className="w-4/12 p-4 flex flex-col justify-between rounded-xl border border-neutral-800 bg-midnight-200/70">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-300">
          Repository Overview
        </span>
        <span className="text-xs text-neutral-500">
          Summary of the repository details
        </span>
      </div>

      {/* Repo summary */}
      <div className="flex flex-col gap-4 h-[13rem] justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-neutral-500 leading-relaxed">
            {data.summary}
          </p>
          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs p-1 px-3">
              Branch · {data.branch.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs p-1 px-3">
              Visibility · {data.visibility.toUpperCase()}
            </Badge>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {data.techstack.map((tech, index) => (
              <Badge
                key={tech}
                variant="outline"
                className={`text-[12px] ${pickBadgeColor(index)}`}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
