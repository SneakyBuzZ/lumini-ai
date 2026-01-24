type LanguageStat = {
  name: string;
  percentage: number;
};

export function LanguageCompositionCard({
  languages,
}: {
  languages: LanguageStat[];
}) {
  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-neutral-800 bg-midnight-200/70 p-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-300">
          Language Composition
        </span>
        <span className="text-xs text-neutral-500">
          Breakdown of languages used in the project
        </span>
      </div>

      <div className="flex gap-4 h-[13rem]">
        {/* Table */}
        <div className="flex-1 overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-900">
              <tr className="text-neutral-400">
                <th className="px-3 py-1.5 font-medium text-left">Language</th>
                <th className="px-3 py-1.5 font-medium text-right">Usage</th>
              </tr>
            </thead>

            <tbody>
              {languages.map((lang) => (
                <tr key={lang.name} className="border-t border-neutral-800">
                  <td className="px-3 py-1.5 text-neutral-200">{lang.name}</td>

                  <td className="px-3 py-1.5">
                    <div className="flex items-center justify-end gap-3">
                      <span className="tabular-nums text-neutral-400">
                        {lang.percentage}%
                      </span>

                      <div className="h-2 w-20 overflow-hidden rounded-full bg-neutral-800">
                        <div
                          className={`h-full ${getLanguageColor(lang.name)}`}
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {languages.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-6 text-center text-neutral-500"
                  >
                    No language data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Donut */}
        {languages.length > 0 && (
          <div className="flex w-36 flex-col items-center justify-center gap-3">
            <span className="text-xs text-neutral-400">Distribution</span>
            <LanguageDonutChart languages={languages} />
            <span className="text-xs text-neutral-300">
              Most used : {languages[0].name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3b82f6", // blue-500
  JavaScript: "#facc15", // yellow-400
  HTML: "#fb923c", // orange-400
  CSS: "#38bdf8", // sky-400
  Other: "#737373", // neutral-500
  Python: "#3776ab", // blue-ish
  Java: "#b07219", // brown-ish
  Ruby: "#701516", // dark red
  Go: "#00add8", // light blue
  PHP: "#777bb4", // purple-ish
  CSharp: "#178600", // green-ish
  CPlusPlus: "#f34b7d", // pink-ish
  C: "#555555", // gray
  Shell: "#89e051", // light green
};

const LANGUAGE_BG_COLORS: Record<string, string> = {
  TypeScript: "bg-[#3b82f6]",
  JavaScript: "bg-[#facc15]",
  HTML: "bg-[#fb923c]",
  CSS: "bg-[#38bdf8]",
  Other: "bg-[#737373]",
  Python: "bg-[#3776ab]",
  Java: "bg-[#b07219]",
  Ruby: "bg-[#701516]",
  Go: "bg-[#00add8]",
  PHP: "bg-[#777bb4]",
  CSharp: "bg-[#178600]",
  CPlusPlus: "bg-[#f34b7d]",
  C: "bg-[#555555]",
  Shell: "bg-[#89e051]",
};

function getLanguageColor(name: string) {
  return LANGUAGE_BG_COLORS[name] ?? "bg-neutral-500";
}

import { Cell, Pie, PieChart } from "recharts";

function LanguageDonutChart({
  languages,
}: {
  languages: { name: string; percentage: number }[];
}) {
  return (
    <PieChart width={150} height={150}>
      <Pie
        data={languages}
        dataKey="percentage"
        nameKey="name"
        innerRadius={55}
        outerRadius={75}
        stroke="none"
      >
        {languages.map((lang) => (
          <Cell key={lang.name} fill={LANGUAGE_COLORS[lang.name]} />
        ))}
      </Pie>
    </PieChart>
  );
}
