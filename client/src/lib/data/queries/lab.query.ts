import { useQuery } from "@tanstack/react-query";
import { getAll } from "../api/lab.api";

export const useGetAllLabs = () => {
  return useQuery({
    queryKey: ["getAllLabs"],
    queryFn: getAll,
    retry: 1,
    staleTime: 1000 * 60 * 3,
  });
};
