import { Cursor } from "@/components/ui/cursor";
import { useGetUser } from "@/lib/api/queries/user-queries";

type Cursor = {
  x: number;
  y: number;
};

type PresenceUser = {
  id: string;
  name: string;
  color: string;
};

type Props = {
  cursors: Map<string, Cursor>;
  users: PresenceUser[];
  transform: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
};

export function RemoteCursors({ cursors, users, transform }: Props) {
  const userMap = new Map(users.map((u) => [u.id, u]));
  const { data: me } = useGetUser();

  return (
    <>
      {[...cursors.entries()].map(([userId, cursor]) => {
        const user = userMap.get(userId);
        if (!user) return null;

        const screenX = cursor.x * transform.scale + transform.offsetX;
        const screenY = cursor.y * transform.scale + transform.offsetY;

        if (userId === me?.id) return null;

        return (
          <Cursor
            key={userId}
            x={screenX}
            y={screenY}
            name={user.name}
            color={user.color}
          />
        );
      })}
    </>
  );
}
