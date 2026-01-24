import FilesCard from "@/components/_lab/dashboard/files-card";
import { LanguageCompositionCard } from "@/components/_lab/dashboard/language-card";
import OverviewCard from "@/components/_lab/dashboard/overview-card";
import Loading from "@/components/shared/loading";
import { getOverview } from "@/lib/api/lab-api";
import { createFileRoute } from "@tanstack/react-router";
import { Github } from "lucide-react";

export const Route = createFileRoute("/dashboard/lab/$id/")({
  loader: async ({ context, params }) => {
    const labId = params.id;
    const response = await context.queryClient.ensureQueryData({
      queryKey: ["lab", labId, "dashboard", "overview"],
      queryFn: () => getOverview(labId),
    });
    return { data: response };
  },
  pendingComponent: Loading,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = Route.useLoaderData();
  console.log(data);

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
      </div>
    </div>
  );
}
