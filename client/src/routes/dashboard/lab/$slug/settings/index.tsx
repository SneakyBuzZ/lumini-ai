import { AISettingsSection } from "@/components/_lab/settings/ai-section";
import { GeneralSection } from "@/components/_lab/settings/general-section";
import { VectorDbSection } from "@/components/_lab/settings/vectordb-section";
import { VisibilityAccessSection } from "@/components/_lab/settings/visibility-access-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getSettings } from "@/lib/api/lab-api";
import { LabSettings } from "@/lib/types/lab-type";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/lab/$slug/settings/")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData({
      queryKey: ["lab-settings", params.slug],
      queryFn: () => getSettings(params.slug),
    });
    return { data: result };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = Route.useLoaderData();

  const [settings, setSettings] = useState<LabSettings>(data);
  const [draft, setDraft] = useState<LabSettings>(data);

  // Reset when server data changes
  useEffect(() => {
    setSettings(data);
    setDraft(data);
  }, [data]);

  const saveSection = async <T,>(
    section: keyof LabSettings,
    value: T,
    setState: React.Dispatch<React.SetStateAction<LabSettings>>,
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update local state
    setState((prev) => ({ ...prev, [section]: value }));
  };

  const isGeneralDirty = isDirty(settings.general, draft.general);
  const isVisibilityDirty = isDirty(
    settings.visibilityAndAccess,
    draft.visibilityAndAccess,
  );
  const isVectorDbDirty = isDirty(settings.vectorDb, draft.vectorDb);
  const isAiDirty = isDirty(settings.ai, draft.ai);

  return (
    <div className="w-full p-8 space-y-4 overflow-y-auto bg-midnight-300/70">
      <div className="flex">
        <h1 className="text-2xl font-semibold">Lab Settings</h1>
        <div className="flex items-center gap-2 ml-auto text-sm text-neutral-300">
          <span>
            Created on{" "}
            {new Date(settings.general.createdAt).toLocaleDateString()} by
          </span>
          <div className="flex justify-start items-center gap-1">
            <Avatar className="w-8 h-8">
              <AvatarImage src={settings.general.creatorImage || undefined} />
              <AvatarFallback>
                {settings.general.creatorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-medium leading-none">
                {settings.general.creatorName}
              </span>
              <div className="text-xs text-neutral-500">
                {settings.general.creatorEmail}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GeneralSection
        isDirty={isGeneralDirty}
        value={draft.general}
        onChange={(v) => setDraft((prev) => ({ ...prev, general: v }))}
        onCancel={() =>
          setDraft((prev) => ({ ...prev, general: settings.general }))
        }
        onSave={() => saveSection("general", draft.general, setSettings)}
      />

      <VisibilityAccessSection
        isDirty={isVisibilityDirty}
        value={draft.visibilityAndAccess}
        onChange={(v) =>
          setDraft((prev) => ({ ...prev, visibilityAndAccess: v }))
        }
        onCancel={() =>
          setDraft((prev) => ({
            ...prev,
            visibilityAndAccess: settings.visibilityAndAccess,
          }))
        }
        onSave={() =>
          saveSection(
            "visibilityAndAccess",
            draft.visibilityAndAccess,
            setSettings,
          )
        }
      />

      <VectorDbSection
        isDirty={isVectorDbDirty}
        value={draft.vectorDb}
        onChange={(v) => setDraft((prev) => ({ ...prev, vectorDb: v }))}
        onCancel={() =>
          setDraft((prev) => ({ ...prev, vectorDb: settings.vectorDb }))
        }
        onSave={() => saveSection("vectorDb", draft.vectorDb, setSettings)}
      />

      <AISettingsSection
        isDirty={isAiDirty}
        value={draft.ai}
        onChange={(v) => setDraft((prev) => ({ ...prev, ai: v }))}
        onCancel={() => setDraft((prev) => ({ ...prev, ai: settings.ai }))}
        onSave={() => saveSection("ai", draft.ai, setSettings)}
      />
    </div>
  );
}

export type SectionProps<T> = {
  value: T;
  onChange: (value: T) => void;
  onCancel: () => void;
  onSave: () => void;
};

function isDirty<T>(original: T, draft: T): boolean {
  return JSON.stringify(original) !== JSON.stringify(draft);
}
