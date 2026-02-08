import { LabVectorDBSettings } from "@/lib/types/lab-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";
import { SectionShell } from "./section-cell";
import { SelectRow } from "./selection-row";
import { InputRow } from "./input-row";

export function VectorDbSection({
  value,
  onChange,
  onCancel,
  onSave,
  isDirty,
}: SectionProps<LabVectorDBSettings> & { isDirty: boolean }) {
  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex flex-col px-1 leading-none">
        <h3 className="text-base font-semibold text-neutral-400 leading-tight">
          Vector Database
        </h3>
        <p className="text-sm text-neutral-600">
          Configure vector storage backend.
        </p>
      </div>
      <SectionShell
        isDirty={isDirty}
        title="Vector Database"
        onCancel={onCancel}
        onSave={onSave}
      >
        <SelectRow
          label="Service"
          value={value.vectorDbService}
          options={["postgresql", "qdrant"]}
          onChange={(nextValue) =>
            onChange({
              ...value,
              vectorDbService: nextValue as "postgres" | "qdrant",
            })
          }
        />

        <InputRow
          label="Connection String"
          placeholder="postgresql://user:password@host:port/dbname"
          value={value.vectorDbConnectionString}
          onChange={(nextValue) =>
            onChange({
              ...value,
              vectorDbConnectionString: nextValue,
            })
          }
        />
      </SectionShell>
    </div>
  );
}
