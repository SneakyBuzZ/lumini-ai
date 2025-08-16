import { ColumnDef } from "@tanstack/react-table";
import { LabWithMembers } from "@/lib/types/lab.type";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "@tanstack/react-router";
import useLabStore from "@/lib/store/lab-store";

interface ClickableLabNameCellProps {
  lab: LabWithMembers;
}

export function ClickableLabNameCell({ lab }: ClickableLabNameCellProps) {
  const navigate = useNavigate();
  const setLab = useLabStore((state) => state.setLab);

  const handleClick = () => {
    setLab(lab);
    // navigate(`/app/labs/${lab.name.replace(/\s+/g, "-").toLowerCase()}`);
    navigate({ to: "/" });
  };

  return (
    <span
      onClick={handleClick}
      className="text-white hover:underline cursor-pointer"
    >
      {lab.name}
    </span>
  );
}

export const labColumns: ColumnDef<LabWithMembers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const lab = row.original;
      return <ClickableLabNameCell lab={lab} />;
    },
  },
  {
    accessorKey: "githubUrl",
    header: "GitHub",
    cell: ({ row }) => {
      const url = row.original.githubUrl;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          GitHub
        </a>
      );
    },
  },
  {
    accessorKey: "creator",
    header: "Creator",
    cell: ({ row }) => {
      const creator = row.original.creator;
      return (
        <div className="flex items-center gap-2">
          <img
            src={creator.image ?? ""}
            alt={creator.name}
            className="w-6 h-6 rounded-full"
          />
          <span>{creator.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "workspace",
    header: "Workspace",
    cell: ({ row }) => {
      return <span>{row.original.workspace.name}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
];
