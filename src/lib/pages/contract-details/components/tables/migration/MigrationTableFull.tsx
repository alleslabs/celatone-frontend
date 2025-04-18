import type { BechAddr32, Option } from "lib/types";

import { TableContainer } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useMigrationHistories } from "lib/pages/contract-details/data";
import { useWasmVerifyInfos } from "lib/services/verification/wasm";

import { MigrationHeader } from "./MigrationHeader";
import { MigrationMobileCard } from "./MigrationMobileCard";
import { MigrationRow } from "./MigrationRow";

interface MigrationTableFullProps {
  contractAddress: BechAddr32;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
}

export const MigrationTableFull = ({
  contractAddress,
  refetchCount,
  scrollComponentId,
  totalData,
}: MigrationTableFullProps) => {
  const isMobile = useMobile();
  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
    total: totalData,
  });

  const { data, error, isLoading } = useMigrationHistories(
    contractAddress,
    offset,
    pageSize
  );
  const { data: wasmVerifyInfos, isLoading: isWasmVerifyInfosLoading } =
    useWasmVerifyInfos(
      data?.items.map((history) => history.codeId) ?? [],
      !!data?.items
    );

  if (isLoading || isWasmVerifyInfosLoading) return <Loading />;
  if (error) return <ErrorFetching dataName="migration histories" />;
  if (!data?.items.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="This contract does not have any migration history yet."
        withBorder
      />
    );

  const templateColumns =
    "90px minmax(300px, 1fr) minmax(220px, 1fr) repeat(2, max(150px)) max(232px) max(180px)";

  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          {data.items.map((history, index) => (
            <MigrationMobileCard
              key={`${index.toString()}-${history.codeId}`}
              history={history}
              wasmVerifyInfo={wasmVerifyInfos?.[history.codeId]}
            />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <MigrationHeader templateColumns={templateColumns} />
          {data.items.map((history, index) => (
            <MigrationRow
              key={`${index.toString()}-${history.codeId}`}
              history={history}
              templateColumns={templateColumns}
              wasmVerifyInfo={wasmVerifyInfos?.[history.codeId]}
            />
          ))}
        </TableContainer>
      )}

      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          scrollComponentId={scrollComponentId}
          totalData={totalData}
          onPageChange={(nextPage) => {
            setCurrentPage(nextPage);
            refetchCount();
          }}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            refetchCount();
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};
