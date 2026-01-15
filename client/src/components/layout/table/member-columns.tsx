import { ColumnDef } from "@tanstack/react-table";
import { WorkspaceMember } from "@/lib/types/workspace-type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const memberColumns: ColumnDef<WorkspaceMember>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.member;
      return (
        <div className="flex items-center gap-4 py-2">
          <img
            src={user.image ?? ""}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-md font-semibold text-neutral-300">
              {user.name}
            </span>
            <span className="text-xs">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={"outline"} className="h-7 text-xs px-3 bg-midnight-100">
        {row.original.role.toUpperCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "joinedAt",
    header: "Joined At",
    cell: ({ row }) =>
      new Date(row.original.joinedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: () => (
      <div className="flex justify-end w-full">
        <Button variant={"outline"}>Manager</Button>
      </div>
    ),
  },
];
