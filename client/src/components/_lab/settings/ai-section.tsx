import { useState } from "react";
import { LabAISettings } from "@/lib/types/lab-type";
import { SectionProps } from "@/routes/dashboard/lab/$slug/settings";
import { SectionShell } from "./section-cell";
import { SelectRow } from "./selection-row";
import { InputRow } from "./input-row";
import { Button } from "@/components/ui/button";
import { BASE_URLS, MODELS, TEMPERATURE_OPTIONS } from "@/utils/constant";

interface AISettingsSectionProps extends SectionProps<LabAISettings> {
  isDirty: boolean;
  isPending?: boolean;
}

export function AISettingsSection({
  value,
  onChange,
  onCancel,
  onSave,
  isDirty,
  isPending = false,
}: AISettingsSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex flex-col px-1 leading-none">
        <h3 className="text-base font-semibold text-neutral-400 leading-tight">
          AI Configuration
        </h3>
        <p className="text-sm text-neutral-600">
          Configure model and provider settings for this lab.
        </p>
      </div>

      <SectionShell
        title="AI Configuration"
        isDirty={isDirty}
        onCancel={onCancel}
        onSave={onSave}
        isPending={isPending}
      >
        <SelectRow
          label="API Service"
          value={value.apiService}
          options={["gemini", "openai", "anthropic"]}
          description="Select the AI provider for this lab."
          onChange={(v) =>
            onChange({
              ...value,
              apiService: v as LabAISettings["apiService"],
              modelName: MODELS[v as LabAISettings["apiService"]][0],
              apiBaseUrl: BASE_URLS[v as LabAISettings["apiService"]],
            })
          }
        />

        <SelectRow
          label="Model"
          value={value.modelName}
          options={MODELS[value.apiService]}
          description="Models are limited based on the selected provider."
          onChange={(v) =>
            onChange({
              ...value,
              modelName: v,
            })
          }
        />

        <InputRow
          label="API Key"
          placeholder="••••••••••••••api-key"
          value={value.apiKey}
          mode="apiKey"
          description="Stored securely. You can rotate it, but never view it."
          onChange={(rawKey) =>
            onChange({
              ...value,
              apiKey: rawKey,
              apiKeyLastFour: rawKey.slice(-4),
            })
          }
        />

        <SelectRow
          label="Temperature"
          value={String(value.temperature ?? 0.5)}
          options={TEMPERATURE_OPTIONS}
          description="Controls creativity. Higher values are more random."
          onChange={(v) =>
            onChange({
              ...value,
              temperature: Number(v),
            })
          }
        />

        <div className="py-2 px-5">
          <Button
            type="button"
            size="sm"
            variant="link"
            onClick={() => setShowAdvanced((v) => !v)}
            className="px-0"
          >
            {showAdvanced ? "Hide advanced" : "Show advanced"}
          </Button>
        </div>

        {showAdvanced && (
          <InputRow
            label="API Base URL"
            placeholder="https://api.openai.com/v1"
            value={value.apiBaseUrl ?? BASE_URLS[value.apiService]}
            description="Optional. Leave empty to use provider defaults."
            onChange={(url) =>
              onChange({
                ...value,
                apiBaseUrl: url || BASE_URLS[value.apiService],
              })
            }
          />
        )}
      </SectionShell>
    </div>
  );
}
