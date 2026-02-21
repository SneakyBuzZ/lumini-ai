import { SectionShell } from "@/components/_lab/settings/section-cell";
import { SelectRow } from "@/components/_lab/settings/selection-row";
import { WorkspaceSettingsGeneral } from "@/lib/types/workspace-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";

interface PreferencesProps extends SectionProps<WorkspaceSettingsGeneral> {
  isDirty: boolean;
  isPending?: boolean;
}

export function Preferences({
  value,
  onChange,
  onCancel,
  onSave,
  isDirty,
  isPending = false,
}: PreferencesProps) {
  const visibilityOptions = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

  const languageOptions = [{ label: "English", value: "en" }];

  const notificationsOptions = [
    { label: "Enabled", value: "enabled" },
    { label: "Disabled", value: "disabled" },
  ];
  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex flex-col px-1 leading-none">
        <h3 className="text-base font-semibold text-neutral-400 leading-tight">
          Preferences
        </h3>
        <p className="text-sm text-neutral-600">
          Configure your workspace preferences.
        </p>
      </div>
      <SectionShell
        title="Preferences"
        isDirty={isDirty}
        onCancel={onCancel}
        onSave={onSave}
        isPending={isPending}
      >
        <SelectRow
          label="Visibility"
          value={value.settings.visibility}
          options={visibilityOptions}
          description="Set the visibility of your workspace."
          onChange={(v) =>
            onChange({
              ...value,
              settings: {
                ...value.settings,
                visibility: v,
              },
            })
          }
        />
        <SelectRow
          label="Default Language"
          value={value.settings.defaultLanguage}
          options={languageOptions}
          description="Set the default language for your workspace."
          onChange={(v) =>
            onChange({
              ...value,
              settings: {
                ...value.settings,
                defaultLanguage: v,
              },
            })
          }
        />
        <SelectRow
          label="Notifications"
          value={value.settings.notificationsEnabled ? "enabled" : "disabled"}
          options={notificationsOptions}
          description="Enable or disable notifications for your workspace."
          onChange={(v) =>
            onChange({
              ...value,
              settings: {
                ...value.settings,
                notificationsEnabled: v === "enabled",
              },
            })
          }
        />
      </SectionShell>
    </div>
  );
}
