import { useQuery } from "@tanstack/react-query";
import { getIsAuthenticated, getUser } from "@/lib/data/api/user.api";

export const useGetIsAuthenticated = () => {
  return useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: getIsAuthenticated,
    retry: 1,
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};
