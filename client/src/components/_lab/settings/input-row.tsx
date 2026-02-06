import { Input } from "@/components/ui/input";

type InputRowProps = {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  isSecret?: boolean;
  isDisabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function InputRow({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  isSecret = false,
  isDisabled = false,
}: InputRowProps) {
  if (isSecret) {
    return (
      <div className="flex items-center justify-between gap-6">
        <span className="text-sm font-medium text-neutral-300 w-48">
          {label}
        </span>
        <Input
          type={"password"}
          value={value || ""}
          placeholder={placeholder}
          onChange={onChange}
          className="max-w-md"
          autoComplete="new-password"
          disabled={isDisabled}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm font-medium text-neutral-300 w-48">{label}</span>
      <Input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={onChange}
        className="max-w-md"
        autoComplete="new-password"
        disabled={isDisabled}
      />
    </div>
  );
}
