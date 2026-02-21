import { InputRow } from "@/components/_lab/settings/input-row";
import { SectionShell } from "@/components/_lab/settings/section-cell";
import { WorkspaceSettingsGeneral } from "@/lib/types/workspace-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";

interface GeneralDetailsProps extends SectionProps<WorkspaceSettingsGeneral> {
  isDirty: boolean;
  isPending?: boolean;
}

export function GeneralDetails({
  value,
  isDirty,
  isPending,
  onCancel,
  onChange,
  onSave,
}: GeneralDetailsProps) {
  const update = (k: keyof WorkspaceSettingsGeneral, v: string) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex flex-col px-1 leading-none">
        <h3 className="text-base font-semibold text-neutral-400 leading-tight">
          Workspace Details
        </h3>
        <p className="text-sm text-neutral-600">
          Update workspace identity and repository info.
        </p>
      </div>
      <SectionShell
        title="Workspace Details"
        onCancel={onCancel}
        onSave={onSave}
        isDirty={isDirty}
        isPending={isPending}
      >
        <InputRow
          label="Name"
          placeholder="Workspace Name"
          value={value.name}
          onChange={(nextValue) => update("name", nextValue)}
        />
        <InputRow
          label="Slug"
          placeholder="Workspace Slug"
          value={value.slug}
          isDisabled={true}
          onChange={(nextValue) => update("slug", nextValue)}
        />
      </SectionShell>
    </div>
  );
}
