import { formatDistanceToNow } from "date-fns";

interface FilesCardProps {
  architecture: { name: string; percentage: number }[];
  files: number;
  sizeKb: string;
  lastActivityAt: string;
  scope: string;
}

export default function FilesCard({
  architecture,
  files,
  sizeKb,
  lastActivityAt,
  scope,
}: FilesCardProps) {
  const addColor = (index: number) => {
    const colors = [
      "bg-cyan",
      "bg-yellow-400",
      "bg-violet-500/90",
      "bg-pink-500/90",
      "bg-green-500/90",
      "bg-orange-500/90",
    ];
    return colors[index % colors.length];
  };

  const kbToMb = (kb: number) => {
    return (kb / 1024).toFixed(2) + " MB";
  };

  const normalizeLastActivity = (activity: string) => {
    const date = new Date(activity);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  return (
    <div className="w-4/12 p-4 flex flex-col justify-between gap-4 rounded-xl border border-neutral-800 bg-midnight-200/70">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-300">
          Files Architecture
        </span>
        <span className="text-xs text-neutral-500">
          Top-level folder distribution
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {architecture.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-md border border-neutral-800/40 bg-midnight-100 px-3 py-1.5"
          >
            <span className="text-[12px] text-neutral-200">{item.name}</span>

            <div className="flex items-center gap-3 w-40">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full ${addColor(index)}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-neutral-400">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-neutral-400 w-full px-">
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">Files</span>
          <span className="font-medium text-neutral-300">{files}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-neutral-500">Size</span>
          <span className="font-medium text-neutral-300">
            {kbToMb(Number(sizeKb))} MB
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-neutral-500">Activity</span>
          <span className="font-medium text-neutral-300">
            {normalizeLastActivity(lastActivityAt)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-neutral-500">Scope</span>
          <span className="font-medium text-neutral-300">
            {scope.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
