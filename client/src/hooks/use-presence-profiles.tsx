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
    const ids = presence.map((u) => u.id);

    const missingIds = ids.filter((id) => !cacheRef.current.has(id));

    if (missingIds.length > 0) {
      api
        .get("/user/all", {
          params: { ids: missingIds.join(",") },
        })
        .then((res) => {
          for (const user of res.data.payload) {
            cacheRef.current.set(user.id, user);
          }

          setProfiles(
            presence
              .map((u) => {
                const profile = cacheRef.current.get(u.id);
                return profile ? { ...profile, color: u.color } : null;
              })
              .filter(Boolean) as UserProfile[],
          );
        });

      return;
    }

    setProfiles(
      presence
        .map((u) => {
          const profile = cacheRef.current.get(u.id);
          return profile ? { ...profile, color: u.color } : null;
        })
        .filter(Boolean) as UserProfile[],
    );
  }, [presence]);

  return profiles;
}
