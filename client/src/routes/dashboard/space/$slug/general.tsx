import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { getWorkspaceSettings } from "@/lib/api/workspace-api";
import { cn } from "@/utils/cn.util";
import { GeneralDetails } from "@/components/_workspace/settings/general-details";
import { Preferences } from "@/components/_workspace/settings/preferences";
import { DangerZone } from "@/components/_workspace/settings/danger-zone";
import { useState } from "react";
import { WorkspaceSettingsGeneral } from "@/lib/types/workspace-type";
import {
  useUpdateGeneral,
  useUpdatePreferences,
} from "@/lib/api/mutations/workspace-mutations";

export const Route = createFileRoute("/dashboard/space/$slug/general")({
  loader: async ({ context, params }) => {
    const general = await context.queryClient.ensureQueryData({
      queryKey: ["workspace-settings", params.slug, "general"],
      queryFn: () => getWorkspaceSettings("general", params.slug),
    });
    return { data: general };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { pathname } = useLocation();
  const lastSegement = pathname.split("/").pop();
  const isActive = (to: string) => lastSegement === to;

  const { data: general } = Route.useLoaderData();
  const [settings, setSettings] = useState<WorkspaceSettingsGeneral>(general);
  const [draft, setDraft] = useState<WorkspaceSettingsGeneral>(general);

  const isGeneralDirty = isDirty(settings, draft);
  const isPreferencesDirty = isDirty(settings, draft);

  const { mutateAsync: updateGeneral, isPending: isGeneralPending } =
    useUpdateGeneral();
  const { mutateAsync: updatePreferences, isPending: isPreferencesPending } =
    useUpdatePreferences();

  const saveGeneral = async () => {
    await updateGeneral({ settings: draft, slug });
    setSettings((prev) => ({
      ...prev,
      name: draft.name,
      slug: draft.slug,
    }));
  };

  const savePreferences = async () => {
    await updatePreferences({
      preferences: draft.settings,
      slug,
    });
    setSettings((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        visibility: draft.settings.visibility,
        defaultLanguage: draft.settings.defaultLanguage,
        notificationsEnabled: draft.settings.notificationsEnabled,
      },
    }));
  };

  return (
    <div className="w-full flex flex-col justify-start items-start bg-midnight-300/70 h-full space-y-10 p-10 px-20 overflow-y-scroll">
      <div className="w-full flex flex-col space-y-5">
        <h3 className="text-2xl font-space tracking-tight text-neutral-300 font-semibold">
          Workspace Settings
        </h3>
        <div className="flex space-x-6 border-b border-midnight-100 w-full">
          {SETTINGS_LIST.map((setting) => (
            <Link
              key={setting.to}
              to={setting.to}
              className={cn(
                "pb-2 font-medium text-neutral-500 hover:text-neutral-400 transition-colors",
                isActive(setting.to) &&
                  "border-b-2 border-neutral-400 text-neutral-300",
              )}
            >
              {setting.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-8 pb-16">
        <GeneralDetails
          value={draft}
          isDirty={isGeneralDirty}
          isPending={isGeneralPending}
          onChange={(v) => setDraft((prev) => ({ ...prev, ...v }))}
          onCancel={() => setDraft((prev) => ({ ...prev, ...settings }))}
          onSave={saveGeneral}
        />

        <Preferences
          value={draft}
          isDirty={isPreferencesDirty}
          isPending={isPreferencesPending}
          onChange={(v) => setDraft((prev) => ({ ...prev, ...v }))}
          onCancel={() => setDraft((prev) => ({ ...prev, ...settings }))}
          onSave={savePreferences}
        />

        <div className="w-full flex flex-col space-y-5">
          <div className="flex flex-col px-1">
            <h3 className="text-xl font-semibold text-neutral-400">
              Danger Zone
            </h3>
            <p className="text-md text-neutral-600">
              Critical actions for your workspace. Proceed with caution.
            </p>
          </div>
          <DangerZone />
        </div>
      </div>
    </div>
  );
}

const SETTINGS_LIST = [
  { name: "General", to: "general" },
  { name: "Integrations", to: "integrations" },
  { name: "Usage", to: "usage" },
];

function isDirty<T>(original: T, draft: T): boolean {
  return JSON.stringify(original) !== JSON.stringify(draft);
}
