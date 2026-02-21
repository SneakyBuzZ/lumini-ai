import Spinner from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { useLocation } from "@tanstack/react-router";

interface SectionCellProps {
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onSave: () => void;
  isDirty: boolean;
  isPending?: boolean;
}

export function SectionShell({
  title,
  children,
  onCancel,
  onSave,
  isDirty,
  isPending = false,
}: SectionCellProps) {
  const { hash } = useLocation();
  const divId = title.toLowerCase().split(" ").join("-");
  const isFocused = hash === divId;

  return (
    <div
      id={divId}
      className={`
        w-full
        border
        border-dashed
        rounded-xl
        ${isFocused ? "border-neutral-700/70 bg-midnight-200/50" : "border-midnight-100 bg-midnight-200/40"}
      `}
    >
      {/* Rows */}
      <div className="divide-y divide-dashed divide-midnight-100">
        {children}
      </div>

      {/* Actions (same placement as GeneralDetails) */}
      <div
        className={`flex justify-end items-center gap-2 p-4 py-3 bg-midnight-300/40 border-t border-dashed rounded-b-xl ${isFocused ? "border-neutral-700/70 bg-midnight-200/50" : "border-midnight-100 bg-midnight-200/40"}`}
      >
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={!isDirty || isPending} onClick={onSave}>
          Save Changes
          {isPending && <Spinner />}
        </Button>
      </div>
    </div>
  );
}
