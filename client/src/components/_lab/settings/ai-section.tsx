import { LabAISettings } from "@/lib/types/lab-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";
import { SectionShell } from "./section-cell";
import { SelectRow } from "./selection-row";
import { InputRow } from "./input-row";

export function AISettingsSection({
  value,
  onChange,
  onCancel,
  onSave,
  isDirty,
}: SectionProps<LabAISettings> & { isDirty: boolean }) {
  return (
    <SectionShell
      isDirty={isDirty}
      title="AI Configuration"
      description="Model and API settings for this lab."
      onCancel={onCancel}
      onSave={onSave}
    >
      <SelectRow
        label="API Service"
        value={value.apiService}
        options={["gemini", "openai", "anthropic"]}
        onChange={(v) =>
          onChange({
            ...value,
            apiService: v as "gemini" | "openai" | "anthropic",
          })
        }
      />

      <InputRow
        label="API Base URL"
        placeholder="https://api.gemini.com/query"
        value={value.apiBaseUrl}
        onChange={(e) => onChange({ ...value, apiBaseUrl: e.target.value })}
      />

      <InputRow
        label="API Key"
        placeholder="ghk-compaofdibn092i194wd"
        value={value.apiKey}
        onChange={(e) => onChange({ ...value, apiKey: e.target.value })}
        isSecret={true}
      />

      <InputRow
        label="Model"
        placeholder="gemini-1.5.flash"
        value={value.modelName}
        onChange={(e) => onChange({ ...value, modelName: e.target.value })}
      />

      <InputRow
        label="Temperature"
        placeholder="0.5"
        value={value.temperature.toString()}
        onChange={(e) =>
          onChange({ ...value, temperature: Number(e.target.value) })
        }
      />
    </SectionShell>
  );
}
