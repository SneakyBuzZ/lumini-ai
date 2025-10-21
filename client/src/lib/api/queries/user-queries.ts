import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/lib/store/auth-store";
import { getUser } from "@/lib/api/user-api";

export const useGetUser = () => {
  const { user, authenticated, setUser } = useAuthStore();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (authenticated && !user) {
        const userData = await getUser();
        if (userData) {
          setUser(userData);
        }
        return userData;
      }
      return null;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
