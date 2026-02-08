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
    <div className="w-full flex flex-col space-y-3">
      <div className="flex flex-col px-1 leading-none">
        <h3 className="text-base font-semibold text-neutral-400 leading-tight">
          Visibility & Access
        </h3>
        <p className="text-sm text-neutral-600">
          Control who can see and join this lab.
        </p>
      </div>
      <SectionShell
        isDirty={isDirty}
        title="Visibility & Access"
        onCancel={onCancel}
        onSave={onSave}
      >
        <SelectRow
          label="Visibility"
          value={value.visibility}
          options={["public", "private"]}
          onChange={(nextValue) =>
            onChange({
              ...value,
              visibility: nextValue as "public" | "private",
            })
          }
        />

        <InputRow
          label="Max users"
          placeholder="100"
          value={String(value.maxLabUsers)}
          isDisabled={true}
          onChange={(nextValue) =>
            onChange({ ...value, maxLabUsers: Number(nextValue) })
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
    </div>
  );
}
