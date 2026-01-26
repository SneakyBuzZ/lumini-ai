import { Button } from "@/components/ui/button";

export function SectionShell({
  title,
  description,
  children,
  onCancel,
  onSave,
  isDirty,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onCancel: () => void;
  onSave: () => void;
  isDirty: boolean;
}) {
  return (
    <div className="rounded-xl border border-dashed border-midnight-100 bg-midnight-200/40">
      <div className="p-4 border-b border-dashed border-midnight-100 bg-midnight-200/90 rounded-t-xl">
        <h3 className="text-lg font-semibold text-neutral-300">{title}</h3>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>

      <div className="p-4 space-y-4">{children}</div>

      <div className="flex justify-end gap-2 p-4 py-3 border-t border-dashed border-midnight-100">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={!isDirty} variant={"primary"} onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
