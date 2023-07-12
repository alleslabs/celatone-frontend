import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { ErrorFetching } from "../../ErrorFetching";
import { MobileTitle } from "../../mobile/MobileTitle";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { useAccountCodes } from "lib/pages/account-details/data";
import type { HumanAddr, Option } from "lib/types";

import { StoredCodesBody } from "./StoredCodesBody";

interface StoredCodesTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

const CodeTitle = ({
  onViewMore,
  totalData,
}: {
  onViewMore: StoredCodesTableProps["onViewMore"];
  totalData: Option<number>;
}) => {
  const isMobile = useMobile();
  if (isMobile && onViewMore)
    return (
      <MobileTitle
        title="Stored Codes"
        count={totalData ?? 0}
        onViewMore={onViewMore}
      />
    );
  return (
    <TableTitle
      title="Stored Codes"
      count={totalData ?? 0}
      mb={2}
      helperText="This account stored the following codes"
    />
  );
};
export const StoredCodesTable = ({
  walletAddress,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
}: StoredCodesTableProps) => {
  const navigate = useInternalNavigate();
  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });

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
  const { codes, isLoading } = useAccountCodes(
    walletAddress,
    offset,
    onViewMore ? 5 : pageSize
  );

  const onPageChange = (nextPage: number) => {
    refetchCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchCount();
    setPageSize(size);
    setCurrentPage(1);
  };
  const isMobile = useMobile();
  let isMobileDetail = null;
  if (isMobile && onViewMore) {
    isMobileDetail = false;
  } else {
    isMobileDetail = true;
  }
  return (
    <Box mt={{ base: 4, md: 8 }}>
      <CodeTitle onViewMore={onViewMore} totalData={totalData} />
      {isMobileDetail && (
        <StoredCodesBody
          codes={codes}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              message={
                !codes ? (
                  <ErrorFetching />
                ) : (
                  "This account did not stored any codes before."
                )
              }
              withBorder
            />
          }
          onRowSelect={onRowSelect}
          onViewMore={onViewMore}
        />
      )}
      {!!totalData &&
        (onViewMore
          ? totalData > 5 && !isMobile && <ViewMore onClick={onViewMore} />
          : totalData > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={totalData}
                scrollComponentId={scrollComponentId}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            ))}
    </Box>
  );
};
