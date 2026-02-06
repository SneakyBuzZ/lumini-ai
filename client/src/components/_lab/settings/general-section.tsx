import { LabGeneralSettings } from "@/lib/types/lab-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";
import { InputRow } from "./input-row";
import { SectionShell } from "./section-cell";

export function GeneralSection({
  value,
  onChange,
  onCancel,
  onSave,
  isDirty,
}: SectionProps<LabGeneralSettings> & { isDirty: boolean }) {
  const update = (k: keyof LabGeneralSettings, v: string) =>
    onChange({ ...value, [k]: v });

  return (
    <SectionShell
      title="General Details"
      description="Update lab identity and repository info."
      onCancel={onCancel}
      onSave={onSave}
      isDirty={isDirty}
    >
      <InputRow
        label="Name"
        placeholder="Lab Name"
        value={value.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <InputRow
        label="Slug"
        placeholder="xen-sort-23224"
        value={value.slug}
        onChange={(e) => update("slug", e.target.value)}
      />
      <InputRow
        label="GitHub URL"
        placeholder="https://github.com/username/repo-name"
        value={value.githubUrl}
        onChange={(e) => update("githubUrl", e.target.value)}
      />
    </SectionShell>
  );
}
