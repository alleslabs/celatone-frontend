import { TableContainer } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useMigrationHistories } from "lib/pages/contract-details/data";
import type { BechAddr32, Option } from "lib/types";

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
  scrollComponentId,
  totalData,
  refetchCount,
}: MigrationTableFullProps) => {
  const isMobile = useMobile();
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

  const { data, isLoading, error } = useMigrationHistories(
    contractAddress,
    offset,
    pageSize
  );

  if (isLoading) return <Loading />;
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
          {data.items.map((history) => (
            <MigrationMobileCard key={history.codeId} history={history} />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <MigrationHeader templateColumns={templateColumns} />
          {data.items.map((history) => (
            <MigrationRow
              key={history.codeId}
              history={history}
              templateColumns={templateColumns}
            />
          ))}
        </TableContainer>
      )}

      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
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
