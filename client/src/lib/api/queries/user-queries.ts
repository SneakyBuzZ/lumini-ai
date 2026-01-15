import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api/user-api";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
