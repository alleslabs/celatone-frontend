import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

/**
 * Extended UseInfiniteQueryResult with separate total count query
 * Used for paginated queries where count is fetched separately for performance
 */
export type UseInfiniteQueryWithCountResult<TData> = UseInfiniteQueryResult<
  InfiniteData<TData>
> & {
  countError?: Error;
  isCountLoading: boolean;
  totalCount?: number;
};
