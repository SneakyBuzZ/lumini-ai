import { ColumnDef } from "@tanstack/react-table";
import { Lab } from "@/lib/types/lab-type";
import { useNavigate } from "@tanstack/react-router";
import useAppStore from "@/lib/store/project-store";

interface ClickableLabNameCellProps {
  lab: Lab;
}

function ClickableLabNameCell({ lab }: ClickableLabNameCellProps) {
  const navigate = useNavigate();
  const setLab = useAppStore((state) => state.setCurrentLab);

  const handleClick = () => {
    setLab(lab);
    navigate({ to: "/dashboard/lab/$id", params: { id: lab.id } });
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

export const labColumns: ColumnDef<Lab>[] = [
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
