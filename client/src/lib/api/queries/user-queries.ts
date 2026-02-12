import { useQuery } from "@tanstack/react-query";
import { getIsAuthenticated, getUser } from "@/lib/api/user-api";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useGetIsAuthenticated = () => {
  return useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: () => getIsAuthenticated(),
  });
};
