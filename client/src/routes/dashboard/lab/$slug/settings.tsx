import { AISettingsSection } from "@/components/_lab/settings/ai-section";
import { GeneralSection } from "@/components/_lab/settings/general-section";
import { VectorDbSection } from "@/components/_lab/settings/vectordb-section";
import { VisibilityAccessSection } from "@/components/_lab/settings/visibility-access-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_URLS } from "@/utils/constant";

import { getSettings } from "@/lib/api/lab-api";
import {
  useUpdateLabAISettings,
  useUpdateLabGeneralSettings,
} from "@/lib/api/mutations/app-mutations";
import { LabSettings } from "@/lib/types/lab-type";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/lab/$slug/settings")({
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
  const { slug: labSlug } = Route.useParams();
  const [settings, setSettings] = useState<LabSettings>(data);
  const [draft, setDraft] = useState<LabSettings>(data);
  const { hash } = useLocation();

  const isGeneralDirty = isDirty(settings.general, draft.general);
  const isVisibilityDirty = isDirty(
    settings.visibilityAndAccess,
    draft.visibilityAndAccess,
  );
  const isVectorDbDirty = isDirty(settings.vectorDb, draft.vectorDb);
  const isAiDirty = isDirty(settings.ai, draft.ai);

  const { mutateAsync: updateGeneral, isPending: isGeneralPending } =
    useUpdateLabGeneralSettings();
  const { mutateAsync: updateAI, isPending: isAIPending } =
    useUpdateLabAISettings();

  // Reset when server data changes
  useEffect(() => {
    const normalized: LabSettings = {
      ...data,
      ai: {
        apiService: data.ai.apiService,
        modelName: data.ai.modelName,
        temperature: Number(data.ai.temperature ?? 0.5),
        apiBaseUrl:
          data.ai.apiBaseUrl ??
          BASE_URLS[data.ai.apiService as keyof typeof BASE_URLS],
        apiKeyLastFour: data.ai.apiKeyLastFour ?? "abcd",
        apiKey: `••••••••••••••${data.ai.apiKeyLastFour ?? "abcd"}`,
      },
    };
    setSettings(normalized);
    setDraft(normalized);
  }, [data]);

  useLayoutEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");

    const el = document.getElementById(id);
    const container = document.getElementById("settings-scroll");

    if (!el || !container) return;

    container.scrollTo({
      top: el.offsetTop - 200,
      behavior: "smooth",
    });
  }, [hash]);

  const saveGeneral = async () => {
    await updateGeneral({
      labSlug,
      name: draft.general.name,
    });
    setSettings((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        name: draft.general.name,
      },
    }));
    toast("General settings updated successfully!");
  };

  const saveAI = async () => {
    if (!draft.ai.apiKey) {
      toast.error("API Key is required to save AI settings.");
      return;
    }
    await updateAI({
      labSlug,
      ...draft.ai,
    });

    setSettings((prev) => ({
      ...prev,
      ai: {
        ...prev.ai,
        apiService: draft.ai.apiService,
        modelName: draft.ai.modelName,
        temperature: draft.ai.temperature,
        apiBaseUrl: draft.ai.apiBaseUrl,
        apiKeyLastFour: draft.ai.apiKey.slice(-4),
      },
    }));
    toast("AI settings updated successfully!");
  };

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

  return (
    <div
      id="settings-scroll"
      data-settings-scroll
      className="w-full h-[calc(100vh-64px)] overflow-y-auto space-y-4 bg-midnight-300/70"
    >
      <div className="flex items-center justify-between border-b border-neutral-900 px-9 py-4">
        <h1 className="text-neutral-300 text-xl font-semibold">Lab Settings</h1>
        <div className="flex items-center gap-4 ml-auto text-sm text-neutral-300">
          <p className="text-xs text-neutral-500">
            Created on{" "}
            <span className="font-mono text-neutral-400">
              {new Date(settings.general.createdAt).toLocaleDateString()}
            </span>{" "}
            by
          </p>
          <div className="flex justify-start items-center gap-2">
            <Avatar className="w-7 h-7">
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
              <span className="text-sm leading-none text-neutral-300">
                {settings.general.creatorName}
              </span>
              <div className="text-xs text-neutral-500 leading-none">
                {settings.general.creatorEmail}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 px-8 pt-3 pb-16">
        <GeneralSection
          isDirty={isGeneralDirty}
          value={draft.general}
          onChange={(v) => setDraft((prev) => ({ ...prev, general: v }))}
          onCancel={() =>
            setDraft((prev) => ({ ...prev, general: settings.general }))
          }
          onSave={saveGeneral}
          isPending={isGeneralPending}
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
          onSave={saveAI}
          isPending={isAIPending}
        />
      </div>
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
