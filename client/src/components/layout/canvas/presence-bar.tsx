import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types/user-type";
import { SquareMousePointer } from "lucide-react";

import { useMemo } from "react";

type PresenceUser = {
  id: string;
  name: string;
  image: string | null;
  email: string;
  createdAt: string;
  color?: string;
};

type Props = {
  users: PresenceUser[];
  user: User | null;
  presenceUserRef?: React.RefObject<HTMLDivElement>;
};

export function PresenceBar({ users, user }: Props) {
  const allUsers = useMemo(() => {
    const map = new Map<string, PresenceUser>();

    // remote users (already colored)
    for (const u of users) {
      map.set(u.id, u);
    }

    // current user (ensure present + colored)
    if (user) {
      map.set(user.id, {
        ...user,
        color: "#fff9",
      });
    }

    return Array.from(map.values());
  }, [users, user]);

  if (!user) return null;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute bottom-4 left-4 flex justify-center items-center gap-3 p-1.5 bg-midnight-200/70 h-14 rounded-full border border-neutral-800/60 hover:bg-midnight-100/60 transition-colors">
          <span className="h-11 px-3 text-sm flex justify-center items-center gap-2 rounded-full bg-neutral-800/50 border border-neutral-800/60">
            Online
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </span>
          <div className="flex items-center h-11 rounded-full -space-x-5 cursor-pointer">
            {allUsers.map((user) => (
              <Avatar
                key={user.id}
                className="relative h-10 w-10 ring-2 ring-midnight-200"
              >
                <AvatarImage
                  src={user.image || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={8}
          className={`w-[16rem] bg-midnight-200/90 border border-neutral-800 backdrop-blur-md rounded-md p-0`}
        >
          <DropdownMenuLabel className="flex justify-start items-center w-full p-2 text-neutral-200 border-b border-neutral-800">
            Online Users
          </DropdownMenuLabel>
          <div className="flex flex-col p-1">
            {allUsers.map((u) => (
              <DropdownMenuItem
                key={u.id}
                className="flex justify-between items-center gap-1 p-2 rounded hover:bg-midnight-100"
              >
                <div className="flex justify-start items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={u.image || ""} />
                    <AvatarFallback>
                      {u.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className="text-sm font-medium"
                    style={{ color: u.color || "#000" }}
                  >
                    {u.name}
                  </span>
                </div>
                {u.id !== user.id && (
                  <>
                    <button className="flex justify-center items-center gap-2 h-6 rounded-md border border-neutral-800 text-xs bg-midnight-100 px-3">
                      Follow
                      <SquareMousePointer className="h-3 w-3" />
                    </button>
                  </>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
