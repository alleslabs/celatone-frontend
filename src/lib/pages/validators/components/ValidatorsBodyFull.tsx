import type { Option } from "lib/types";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useValidators } from "lib/services/validator";
import { useEffect } from "react";

import type { ValidatorCounts, ValidatorOrder } from "../types";

import { ValidatorsTable } from "./validators-table";

interface ValidatorsBodyFullProps {
  isActive: boolean;
  isDesc: boolean;
  order: ValidatorOrder;
  scrollComponentId: string;
  search: string;
  setCounts: (counts: Option<ValidatorCounts>) => void;
  setIsDesc: (newIsDesc: boolean) => void;
  setOrder: (newOrder: ValidatorOrder) => void;
}

export const ValidatorsBodyFull = ({
  isActive,
  isDesc,
  order,
  scrollComponentId,
  search,
  setCounts,
  setIsDesc,
  setOrder,
}: ValidatorsBodyFullProps) => {
  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 100,
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
      onSuccess: ({ metadata, total }) => {
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
        isActive={isActive}
        isDesc={isDesc}
        isLoading={isLoading}
        isSearching={!!search}
        order={order}
        scrollComponentId={scrollComponentId}
        setIsDesc={setIsDesc}
        setOrder={setOrder}
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          scrollComponentId={scrollComponentId}
          totalData={data.total}
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
