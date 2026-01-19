import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types/user-type";
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
        color: "#2563eb",
      });
    }

    return Array.from(map.values());
  }, [users, user]);

  if (!user) return null;
  return (
    <div className="flex items-center h-11 p-1 pr-[2px] rounded-full -space-x-5">
      {allUsers.map((user) => (
        <Avatar
          key={user.id}
          className="relative h-10 w-10 shadow-neutral-900 shadow-[-4px_2px_6px_rgba(0,0,0,0.2)] ring-2 ring-midnight-200"
        >
          <AvatarImage src={user.image || "https://github.com/shadcn.png"} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
