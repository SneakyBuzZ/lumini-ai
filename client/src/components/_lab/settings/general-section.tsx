import { LabGeneralSettings } from "@/lib/types/lab-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";
import { InputRow } from "./input-row";
import { SectionShell } from "./section-cell";

interface GeneralSectionProps extends SectionProps<LabGeneralSettings> {
  isDirty: boolean;
  isPending?: boolean;
}

export function GeneralSection({
  value,
  onChange,
  onCancel,
  onSave,
  isDirty,
  isPending,
}: GeneralSectionProps) {
  const update = (k: keyof LabGeneralSettings, v: string) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex flex-col px-1 leading-none">
        <h3 className="text-base font-semibold text-neutral-400 leading-tight">
          General Details
        </h3>
        <p className="text-sm text-neutral-600">
          Update lab identity and repository info.
        </p>
      </div>
      <SectionShell
        title="General Details"
        onCancel={onCancel}
        onSave={onSave}
        isDirty={isDirty}
        isPending={isPending}
      >
        <InputRow
          label="Name"
          placeholder="Lab Name"
          value={value.name}
          onChange={(nextValue) => update("name", nextValue)}
        />
        <InputRow
          label="Slug"
          placeholder="xen-sort-23224"
          value={value.slug}
          isDisabled={true}
          onChange={(nextValue) => update("slug", nextValue)}
        />
        <InputRow
          label="GitHub URL"
          placeholder="https://github.com/username/repo-name"
          value={value.githubUrl}
          isDisabled={true}
          onChange={(nextValue) => update("githubUrl", nextValue)}
        />
      </SectionShell>
    </div>
  );
}
