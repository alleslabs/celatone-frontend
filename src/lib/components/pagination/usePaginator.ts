import { useRouter } from "next/router";
import { useState, useMemo, useEffect, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { getFirstQueryParam } from "lib/utils";

type InitialState = {
  pageSize?: number;
  currentPage: number;
  isDisabled?: boolean;
};

type UsePaginator = {
  total?: number;
  initialState: InitialState;
};

export const usePaginator = ({
  total,
  initialState,
}: UsePaginator): {
  offset: number;
  pagesQuantity: number;
  currentPage: number;
  pageSize: number;
  isDisabled: boolean;
  setPageSize: (newPageSize: number) => void;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: (newCurrentPage: number) => void;
} => {
  // const [pageSize, setPageSize] = useState<number>(initialState.pageSize ?? 0);
  // const [currentPage, setCurrentPage] = useState<number>(
  //   initialState.currentPage
  // );
  const router = useRouter();
  const navigate = useInternalNavigate();
  const pageSize = Number(getFirstQueryParam(router.query.pageSize));
  const currentPage = Number(getFirstQueryParam(router.query.page));

  const [isDisabled, setIsDisabled] = useState(
    initialState.isDisabled ?? false
  );

  const offset = useMemo(() => {
    if (!pageSize) return 0;
    return currentPage * pageSize - pageSize;
  }, [currentPage, pageSize]);

  const pagesQuantity = useMemo(() => {
    if (!total || !pageSize) return 0;
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const setCurrentPage = useCallback(
    (newCurrentPage: number) => {
      navigate({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: newCurrentPage,
        },
        options: {
          shallow: true,
        },
      });
    },
    [navigate, router]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      navigate({
        pathname: router.pathname,
        query: {
          ...router.query,
          pageSize: newPageSize,
        },
        options: {
          shallow: true,
        },
      });
    },
    [navigate, router]
  );

  useEffect(() => {
    if (router.isReady && (!pageSize || !currentPage))
      navigate({
        pathname: router.pathname,
        query: {
          ...router.query,
          pageSize: initialState.pageSize ?? 0,
          page: initialState.currentPage,
        },
        options: {
          shallow: true,
        },
      });
  }, [
    currentPage,
    initialState.currentPage,
    initialState.pageSize,
    navigate,
    pageSize,
    router,
  ]);

  return {
    offset,
    currentPage,
    pagesQuantity,
    setCurrentPage,
    pageSize,
    setPageSize,
    isDisabled,
    setIsDisabled,
  };
};
