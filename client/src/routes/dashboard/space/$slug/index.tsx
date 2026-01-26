import { AppTable } from "@/components/layout/table/app-table";
import { labColumns } from "@/components/layout/table/lab-columns";
import CreateButtonsBar from "@/components/shared/create-buttons-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllLabs } from "@/lib/api/lab-api";
import { useGetLabs } from "@/lib/api/queries/app-queries";
import { Lab } from "@/lib/types/lab-type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/space/$slug/")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["labs", params.slug],
      queryFn: () => getAllLabs(params.slug),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: labs, isPending } = useGetLabs(slug);
  return (
    <div className="w-full flex flex-col justify-start items-center bg-midnight-300/70 h-full space-y-8 p-10 overflow-y-auto">
      <div className="space-y-5 w-full">
        <div className="space-y-1 w-full">
          <h3 className="text-xl font-space tracking-tight text-neutral-300  font-semibold">
            Labs
          </h3>
          <p className="text-md text-neutral-500">Workspace Labs</p>
        </div>
        <CreateButtonsBar />
        {isPending ? (
          <PendingLabs />
        ) : (
          <>
            {labs && labs.length > 0 ? (
              <AppTable<Lab> columns={labColumns} data={labs} />
            ) : (
              <EmptyLabs />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PendingLabs() {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-3 rounded-lg">
      <Skeleton className="w-full h-7 bg-midnight-100/80" />
      <Skeleton className="w-full h-7 bg-midnight-100/80" />
      <Skeleton className="w-full h-7 bg-midnight-100/80" />
    </div>
  );
}

function EmptyLabs() {
  return (
    <div className="flex flex-col justify-center items-center w-full border border-dashed border-neutral-800 gap-3 py-10 rounded-lg bg-midnight-100/30">
      <div className="flex flex-col justify-center items-center">
        <span className="text-neutral-200 text-xl font-semibold">No Labs</span>
        <span className="text-neutral-500">Get started by creating one</span>
      </div>
      <Button>Get started</Button>
      <p className="text-xs text-center text-neutral-500 w-1/3 mt-3">
        Dive into your personal workspace where each Lab connects to a GitHub
        repo and helps you illuminate what matters.
      </p>
    </div>
  );
}
