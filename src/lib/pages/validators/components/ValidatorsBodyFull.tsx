import { useEffect } from "react";

import type { ValidatorCounts, ValidatorOrder } from "../types";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useValidators } from "lib/services/validator";
import type { Option } from "lib/types";

import { ValidatorsTable } from "./validators-table";

interface ValidatorsBodyFullProps {
  isActive: boolean;
  setCounts: (counts: Option<ValidatorCounts>) => void;
  order: ValidatorOrder;
  setOrder: (newOrder: ValidatorOrder) => void;
  isDesc: boolean;
  setIsDesc: (newIsDesc: boolean) => void;
  search: string;
  scrollComponentId: string;
}

export const ValidatorsBodyFull = ({
  isActive,
  setCounts,
  order,
  setOrder,
  isDesc,
  setIsDesc,
  search,
  scrollComponentId,
}: ValidatorsBodyFullProps) => {
  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 100,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data, isFetching: isLoading } = useValidators(
    pageSize,
    offset,
    isActive,
    order,
    isDesc,
    search,
    {
      onSuccess: ({ total, metadata }) => {
        setTotalData(total);
        setCounts(metadata);
      },
    }
  );

  useEffect(() => {
    setCurrentPage(1);
    setPageSize(100);
  }, [isActive, order, isDesc, search, setCurrentPage, setPageSize]);

  return (
    <>
      <ValidatorsTable
        data={data}
        isLoading={isLoading}
        isActive={isActive}
        order={order}
        setOrder={setOrder}
        isDesc={isDesc}
        setIsDesc={setIsDesc}
        scrollComponentId={scrollComponentId}
        isSearch={!!search}
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={data.total}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};
