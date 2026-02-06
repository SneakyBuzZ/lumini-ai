import { LabVisibilityAndAccessSettings } from "@/lib/types/lab-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";
import { SectionShell } from "./section-cell";
import { SelectRow } from "./selection-row";
import { InputRow } from "./input-row";

export function VisibilityAccessSection({
  value,
  onChange,
  onCancel,
  onSave,
  isDirty,
}: SectionProps<LabVisibilityAndAccessSettings> & { isDirty: boolean }) {
  return (
    <SectionShell
      isDirty={isDirty}
      title="Visibility & Access"
      description="Control who can see and join this lab."
      onCancel={onCancel}
      onSave={onSave}
    >
      <SelectRow
        label="Visibility"
        value={value.visibility}
        options={["public", "private"]}
        onChange={(v) =>
          onChange({ ...value, visibility: v as "public" | "private" })
        }
      />

      <InputRow
        label="Max users"
        placeholder="100"
        value={String(value.maxLabUsers)}
        isDisabled={true}
        onChange={(e) =>
          onChange({ ...value, maxLabUsers: Number(e.target.value) })
        }
      />

      <SelectRow
        label="Allow public sharing"
        value={value.allowPublicSharing ? "true" : "false"}
        options={["true", "false"]}
        onChange={(v) =>
          onChange({ ...value, allowPublicSharing: v === "true" })
        }
      />
    </SectionShell>
  );
}
