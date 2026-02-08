import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectRowProps = {
  label: string;
  value: string;
  options: readonly string[];
  description?: string;
  onChange: (value: string) => void;
};

export function SelectRow({
  label,
  value,
  options,
  description,
  onChange,
}: SelectRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 p-3">
      <div className="w-80 px-2">
        <span className="text-sm font-medium text-neutral-300">{label}</span>
        {description && (
          <p className="w-full mt-1 text-xs text-neutral-500">{description}</p>
        )}
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="max-w-md h-9 border-midnight-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
