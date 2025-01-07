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
        pageSize: 10,
      },
    });

    const { data, isLoading } = useCodeContracts(codeId, pageSize, offset, {
      onSuccess: ({ total }) => setTotalData(total),
    });

    const tableHeaderId = "contractTableHeader";

    return (
      <>
        <TableTitle
          id={tableHeaderId}
          title="Contract Instances"
          count={data?.total ?? 0}
        />
        <ContractsTable
          emptyState={<NoContracts />}
          contracts={data.items}
          isLoading={isLoading}
          onRowSelect={onRowSelect}
        />
        {!!data?.total && data.total > 10 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            pagesQuantity={pagesQuantity}
            offset={offset}
            onPageChange={setCurrentPage}
            onPageSizeChange={(e) => {
              const size = Number(e.target.value);
              setPageSize(size);
              setCurrentPage(1);
            }}
            scrollComponentId={tableHeaderId}
            totalData={data.total}
          />
        )}
      </>
    );
  }
);
