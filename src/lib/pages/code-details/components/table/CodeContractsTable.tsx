import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ContractsTable, TableTitle } from "lib/components/table";
import { useContractStore } from "lib/providers/store";
import {
  useContractListByCodeIdPagination,
  useContractListCountByCodeId,
} from "lib/services/contractService";
import type { ContractInfo, Option } from "lib/types";

import { NoContracts } from "./NoContracts";

interface CodeContractsTableProps {
  codeId: number;
}

export const CodeContractsTable = observer(
  ({ codeId }: CodeContractsTableProps) => {
    const { getContractLocalInfo } = useContractStore();

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

    const { data: rawCodeContracts, isLoading } =
      useContractListByCodeIdPagination(codeId, offset, pageSize);
    const codeContracts: Option<ContractInfo[]> =
      rawCodeContracts?.map<ContractInfo>((contract) => ({
        ...contract,
        ...getContractLocalInfo(contract.contractAddress),
      }));

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

    // FIXME - might be a better way to scroll to table header
    const tableHeaderId = "contractTableHeader";

    return (
      <>
        <TableTitle title="Contract Instances" count={totalData ?? 0} />
        <ContractsTable
          contracts={codeContracts}
          isLoading={isLoading}
          emptyState={<NoContracts />}
        />
        {totalData && totalData > 10 && (
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
