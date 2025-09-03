import type { UseQueryResult } from "@tanstack/react-query";

import { useEffect, useRef } from "react";

type QueryEvents<RespT, ErrT> = {
  onError: (resp: ErrT) => void;
  onSettled: () => void;
  onSuccess: (resp: RespT) => void;
};

/**
 * A custom hook to handle success and error side effects for a TanStack Query result.
 * This pattern avoids the need for `useCallback` in the parent component.
 * @param query - The result object from a `useQuery` or `useInfiniteQuery` hook.
 * @param callbacks - An object containing `onSuccess` and/or `onError` functions.
 */
export function useQueryEvents<RespT, ErrT>(
  query: UseQueryResult<RespT, ErrT>,
  callbacks: Partial<QueryEvents<RespT, ErrT>>
) {
  const { onError, onSettled, onSuccess } = callbacks;

  // Create refs to hold the latest version of the callbacks.
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onSettledRef = useRef(onSettled);

  // On every render, update the refs to point to the latest callback functions.
  // This is safe to do during the render phase and is more efficient than a useEffect.
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  // This effect is the "trigger" for the success callback.
  // It runs ONLY when `query.data` changes.
  useEffect(() => {
    if (query.isSuccess && query.data && onSuccessRef.current) {
      onSuccessRef.current(query.data);
    }
  }, [query.isSuccess, query.data]);

  // This effect is the "trigger" for the error callback.
  // It runs ONLY when `query.error` changes.
  useEffect(() => {
    if (query.isError && query.error && onErrorRef.current) {
      onErrorRef.current(query.error);
    }
  }, [query.isError, query.error]);

  // This effect is the "trigger" for the settled callback.
  // It runs ONLY when `query.isFetching` is false and `query.isSuccess` or `query.isError` is true.
  useEffect(() => {
    if (
      !query.isFetching &&
      (query.isSuccess || query.isError) &&
      onSettledRef.current
    ) {
      onSettledRef.current();
    }
  }, [query.isFetching, query.isSuccess, query.isError]);
}
