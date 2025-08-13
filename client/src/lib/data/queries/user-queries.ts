import { useQuery } from "@tanstack/react-query";
import { getIsAuthenticated, getUser } from "@/lib/data/api/user-api";
import useUserStore from "@/lib/store/user-store";

export const useGetIsAuthenticated = () => {
  return useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: getIsAuthenticated,
    retry: 1,
    staleTime: 1000 * 60,
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: 1,
    staleTime: 1000 * 60 * 3,
  });
};

export const useUserWithStore = () => {
  const { setUser } = useUserStore.getState();

  return useQuery({
    queryKey: ["getUserWithStore"],
    queryFn: async () => {
      const user = await getUser();
      if (user) {
        setUser(user);
      }
      return user;
    },
    retry: 1,
    staleTime: 1000 * 60 * 3,
  });
};
