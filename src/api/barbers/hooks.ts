import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { BarbersApi } from ".";
import type { ListActiveBarbersResponse } from "./types";

export function useListActiveBarbers(): UseQueryResult<ListActiveBarbersResponse, Error> {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: BarbersApi.listActiveBarbers,
  })
}