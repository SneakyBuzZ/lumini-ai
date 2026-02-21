import { ColumnDef } from "@tanstack/react-table";
import { WorkspaceMember } from "@/lib/types/workspace-type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, X } from "lucide-react";

export const memberColumns: ColumnDef<WorkspaceMember>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-4 py-2 min-h-[56px]">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="w-8 h-8 rounded-full object-cover bg-neutral-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-300">
              <User className="w-4 h-4" />
            </div>
          )}

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-neutral-200">
              {user.name ?? "Invited user"}
            </span>
            <span className="text-xs text-neutral-400">{user.email}</span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;

      return (
        <span
          className={"text-sm text-neutral-300 font-semibold tracking-tight"}
        >
          {role.toLocaleUpperCase()}
        </span>
      );
    },
  },

  {
    accessorKey: "joinedAt",
    header: "Status / Joined",
    cell: ({ row }) => {
      const { joinedAt, status } = row.original;

      return joinedAt ? (
        <span className="text-sm text-neutral-400">
          {new Date(joinedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ) : (
        <Badge
          variant="secondary"
          className="h-6 px-3 bg-neutral-700 text-neutral-300"
        >
          {status}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-end w-full gap-2 opacity-80">
          {/* Pending invite → revoke */}
          {user.joinedAt === null && (
            <Button
              size="icon"
              variant="ghost"
              className="bg-neutral-600 hover:bg-neutral-700 border-none"
            >
              <X size={16} />
            </Button>
          )}

          {/* Active member → manage */}
          {user.joinedAt !== null && (
            <Button variant="default" size="sm" className="px-3">
              Leave Workspace
            </Button>
          )}
        </div>
      );
    },
  },
];
