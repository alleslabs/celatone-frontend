import type { Dispatch, SetStateAction } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { useEffect, useMemo, useState } from "react";

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
  initialState,
  total,
}: UsePaginator): {
  offset: number;
  pagesQuantity: number;
  currentPage: number;
  pageSize: number;
  isDisabled: boolean;
  setTotalData: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
} => {
  const { currentChainId } = useCelatoneApp();

  const [totalData, setTotalData] = useState<number>(total ?? 0);
  const [pageSize, setPageSize] = useState<number>(initialState.pageSize ?? 10);
  const [currentPage, setCurrentPage] = useState<number>(
    initialState.currentPage
  );
  const [isDisabled, setIsDisabled] = useState(
    initialState.isDisabled ?? false
  );

  const offset = useMemo(() => {
    if (!pageSize) {
      return 0;
    }

    return currentPage * pageSize - pageSize;
  }, [currentPage, pageSize]);

  const pagesQuantity = useMemo(() => {
    if (!pageSize) {
      return 0;
    }

    return Math.ceil(totalData / pageSize);
  }, [totalData, pageSize]);

  useEffect(() => {
    setPageSize(initialState.pageSize ?? 10);
    setCurrentPage(1);
  }, [currentChainId, initialState.pageSize]);

  useEffect(() => {
    setTotalData(total ?? 0);
  }, [total]);

  return {
    currentPage,
    isDisabled,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setIsDisabled,
    setPageSize,
    setTotalData,
  };
};
