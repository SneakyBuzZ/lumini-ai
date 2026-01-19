import { api } from "@/lib/config/axios-config";
import { useEffect, useRef, useState } from "react";

type PresenceUser = {
  id: string;
  color: string;
};

type UserProfile = {
  id: string;
  name: string;
  image: string | null;
  email: string;
  createdAt: string;
  color: string;
};

export function usePresenceProfiles(presence: PresenceUser[]) {
  const cacheRef = useRef<Map<string, UserProfile>>(new Map());
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const missingIds = presence
      .map((u) => u.id)
      .filter((id) => !cacheRef.current.has(id));

    if (missingIds.length === 0) {
      setProfiles(
        presence.map((u) => ({
          ...cacheRef.current.get(u.id)!,
          color: u.color,
        })),
      );
      return;
    }

    api
      .get("/user/all", {
        params: { ids: missingIds.join(",") },
      })
      .then((res) => {
        const data = res.data.payload;
        for (const user of data) {
          cacheRef.current.set(user.id, user);
        }

        setProfiles(
          presence.map((u) => ({
            ...cacheRef.current.get(u.id)!,
            color: u.color,
          })),
        );
      });
  }, [presence]);

  return profiles;
}
