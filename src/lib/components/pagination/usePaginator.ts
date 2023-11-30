import { useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

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
  setTotalData: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
} => {
  const [totalData, setTotalData] = useState<number>(total ?? 0);
  const [pageSize, setPageSize] = useState<number>(initialState.pageSize ?? 0);
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
    if (!totalData || !pageSize) {
      return 0;
    }

    return Math.ceil(totalData / pageSize);
  }, [totalData, pageSize]);

  return {
    offset,
    currentPage,
    pagesQuantity,
    setTotalData,
    setCurrentPage,
    pageSize,
    setPageSize,
    isDisabled,
    setIsDisabled,
  };
};
