import { ColumnDef } from "@tanstack/react-table";
import { WorkspaceWithMembers } from "@/lib/types/workspace-type";

export const workspaceColumns: ColumnDef<WorkspaceWithMembers>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => (
      <div className="flex -space-x-2">
        {row.original.members.map((member) => (
          <img
            key={member.id}
            src={member.image ?? ""}
            alt={member.name}
            className="w-6 h-6 rounded-full border-2 border-white"
          />
        ))}
      </div>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.owner;
      return (
        <div className="flex items-center gap-2">
          <img
            src={owner.image ?? ""}
            alt={owner.name}
            className="w-6 h-6 rounded-full"
          />
          <span>{owner.name}</span>
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
