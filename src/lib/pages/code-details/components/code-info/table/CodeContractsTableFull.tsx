import { observer } from "mobx-react-lite";

import { useInternalNavigate } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ContractsTable, TableTitle } from "lib/components/table";
import { useCodeContracts } from "lib/pages/code-details/data";
import type { BechAddr32 } from "lib/types";

import { NoContracts } from "./NoContracts";

interface CodeContractsTableFullProps {
  codeId: number;
}

export const CodeContractsTableFull = observer(
  ({ codeId }: CodeContractsTableFullProps) => {
    const navigate = useInternalNavigate();
    const onRowSelect = (contract: BechAddr32) =>
      navigate({
        pathname: "/contracts/[contract]",
        query: { contract },
      });

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
        pageSize: 10,
        currentPage: 1,
        isDisabled: false,
      },
    });

    const { data, isLoading } = useCodeContracts(codeId, pageSize, offset, {
      onSuccess: ({ total }) => setTotalData(total),
    });

    const tableHeaderId = "contractTableHeader";

    return (
      <>
        <TableTitle
          title="Contract instances"
          count={data?.total ?? 0}
          id={tableHeaderId}
        />
        <ContractsTable
          contracts={data.items}
          isLoading={isLoading}
          emptyState={<NoContracts />}
          onRowSelect={onRowSelect}
        />
        {!!data?.total && data.total > 10 && (
          <Pagination
            currentPage={currentPage}
            pagesQuantity={pagesQuantity}
            offset={offset}
            totalData={data.total}
            scrollComponentId={tableHeaderId}
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
  }
);
