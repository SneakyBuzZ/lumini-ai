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
  options: string[];
  onChange: (value: string) => void;
};

export function SelectRow({ label, value, options, onChange }: SelectRowProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm font-medium text-neutral-300 w-48">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="max-w-md border-midnight-100 h-8">
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
