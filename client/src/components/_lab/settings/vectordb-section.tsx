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
    <SectionShell
      isDirty={isDirty}
      title="Vector Database"
      description="Configure vector storage backend."
      onCancel={onCancel}
      onSave={onSave}
    >
      <SelectRow
        label="Service"
        value={value.vectorDbService}
        options={["postgresql", "qdrant"]}
        onChange={(v) =>
          onChange({ ...value, vectorDbService: v as "postgres" | "qdrant" })
        }
      />

      <InputRow
        label="Connection String"
        placeholder="postgresql://user:password@host:port/dbname"
        value={value.vectorDbConnectionString}
        onChange={(e) =>
          onChange({
            ...value,
            vectorDbConnectionString: e.target.value,
          })
        }
      />
    </SectionShell>
  );
}
