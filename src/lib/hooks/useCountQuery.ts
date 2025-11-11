import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook for fetching count with optimal caching strategy
 * Count is cached in memory for the entire page session and only refetches on page refresh
 */
export function useCountQuery(
  countQueryKey: unknown[],
  countQueryFn: () => Promise<number>,
  enabled: boolean = true
) {
  return useQuery({
    enabled,
    gcTime: Infinity,
    queryFn: countQueryFn,
    queryKey: countQueryKey,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
