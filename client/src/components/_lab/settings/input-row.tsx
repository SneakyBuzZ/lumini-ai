import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

type InputRowProps = {
  label: string;
  value?: string | null;
  placeholder?: string;
  isDisabled?: boolean;
  description?: string;
  mode?: "normal" | "apiKey";
  onChange: (nextValue: string) => void;
};

export function InputRow({
  label,
  value,
  placeholder,
  onChange,
  isDisabled = false,
  description,
  mode = "normal",
}: InputRowProps) {
  const safeValue = value ?? "";

  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const displayValue = useMemo(() => {
    if (mode !== "apiKey") return safeValue;

    // 🔐 Mask unless actively typing
    if (!isFocused || !isEditing) {
      if (!safeValue) return "";
      if (safeValue.length <= 4) return safeValue;
      return `${"•".repeat(safeValue.length - 4)}${safeValue.slice(-4)}`;
    }

    // ✍️ Actively editing → show full value
    return safeValue;
  }, [safeValue, mode, isFocused, isEditing]);

  return (
    <div className="flex items-center justify-between gap-6 p-3">
      <div className="w-80 px-2">
        <span className="text-sm font-medium text-neutral-300">{label}</span>
        {description && (
          <p className="w-full mt-1 text-xs text-neutral-500">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 max-w-md w-full">
        <Input
          type="text"
          value={displayValue}
          placeholder={placeholder}
          autoComplete="new-password"
          disabled={isDisabled}
          onFocus={() => {
            setIsFocused(true);
            setIsEditing(false); // focus alone ≠ editing
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsEditing(false); // reset on blur
          }}
          onChange={(e) => {
            setIsEditing(true); // 👈 THIS is the key line
            onChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
