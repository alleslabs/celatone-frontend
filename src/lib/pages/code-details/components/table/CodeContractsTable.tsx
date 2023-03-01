import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ContractsTable, TableTitle } from "lib/components/table";
import { useContractsByCodeId } from "lib/model/contract";
import { useContractListCountByCodeId } from "lib/services/contractService";

import { NoContracts } from "./NoContracts";

interface CodeContractsTableProps {
  codeId: number;
}

export const CodeContractsTable = observer(
  ({ codeId }: CodeContractsTableProps) => {
    const { data: totalData, refetch } = useContractListCountByCodeId(codeId);
    const {
      pagesQuantity,
      currentPage,
      setCurrentPage,
      pageSize,
      setPageSize,
      offset,
    } = usePaginator({
      total: totalData,
      initialState: {
        pageSize: 10,
        currentPage: 1,
        isDisabled: false,
      },
    });

    const { contracts, isLoading } = useContractsByCodeId(
      codeId,
      offset,
      pageSize
    );

    useEffect(() => {
      setCurrentPage(1);
    }, [pageSize, setCurrentPage]);

    const onPageChange = (nextPage: number) => {
      refetch();
      setCurrentPage(nextPage);
    };

    const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const size = Number(e.target.value);
      refetch();
      setPageSize(size);
    };

    const tableHeaderId = "contractTableHeader";

    return (
      <>
        <TableTitle
          title="Contract Instances"
          count={totalData ?? 0}
          id={tableHeaderId}
        />
        <ContractsTable
          contracts={contracts}
          isLoading={isLoading}
          emptyState={<NoContracts />}
        />
        {!!totalData && totalData > 10 && (
          <Pagination
            currentPage={currentPage}
            pagesQuantity={pagesQuantity}
            offset={offset}
            totalData={totalData}
            scrollComponentId={tableHeaderId}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </>
    );
  }
);
