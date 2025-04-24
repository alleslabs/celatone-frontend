import type { Dispatch, SetStateAction } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { useEffect, useMemo, useState } from "react";

type InitialState = {
  currentPage: number;
  isDisabled?: boolean;
  pageSize?: number;
};

type UsePaginator = {
  initialState: InitialState;
  total?: number;
};

export const usePaginator = ({
  initialState,
  total,
}: UsePaginator): {
  currentPage: number;
  isDisabled: boolean;
  offset: number;
  pageSize: number;
  pagesQuantity: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setTotalData: Dispatch<SetStateAction<number>>;
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
