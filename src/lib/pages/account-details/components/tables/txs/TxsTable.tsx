import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { ErrorFetching } from "../../ErrorFetching";
import { MobileTitle } from "../../mobile/MobileTitle";
import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import type { EmptyStateProps } from "lib/components/state";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import {
  useTxsByAddressPagination,
  useTxsCountByAddress,
} from "lib/services/txService";
import type { HumanAddr, Option, Transaction, TxFilters } from "lib/types";

import { TxsAlert } from "./TxsAlert";
import { TxsBody } from "./TxsBody";
import { TxsTop } from "./TxsTop";

interface TxsTableProps {
  walletAddress: HumanAddr;
  accountId?: Option<number>;
  scrollComponentId: string;
  onViewMore?: () => void;
}

const getEmptyStateProps = (
  filterSelected: string[],
  transactions: Option<Transaction[]>
): EmptyStateProps => {
  if (filterSelected.length) {
    return { message: "No past transaction matches found with your input." };
  }
  if (!transactions) {
    return {
      message: <ErrorFetching />,
    };
  }
  return {
    message: "This account did not submit any transactions before.",
  };
};

const TxTitle = ({
  onViewMore,
  failureReason,
  txsCount,
}: {
  onViewMore: TxsTableProps["onViewMore"];
  failureReason: unknown;
  txsCount: number;
}) => {
  const isMobile = useMobile();

  if (isMobile && onViewMore)
    return (
      <MobileTitle
        title="Transactions"
        count={failureReason ? "N/A" : txsCount}
        onViewMore={onViewMore}
      />
    );
  return (
    <TableTitle
      title="Transactions"
      count={failureReason ? "N/A" : txsCount}
      mb={2}
    />
  );
};
export const TxsTable = ({
  walletAddress,
  accountId,
  scrollComponentId,
  onViewMore,
}: TxsTableProps) => {
  const [isSigner, setIsSigner] = useState<Option<boolean>>();
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_TX_FILTERS);

  const {
    data: txsCount = 0,
    refetch: refetchTxsCount,
    isLoading: txsCountLoading,
    failureReason,
  } = useTxsCountByAddress(walletAddress, accountId, "", filters, isSigner);

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: txsCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const resetPagination = () => {
    setPageSize(10);
    setCurrentPage(1);
  };

  const handleSetFilters = (filter: string, bool: boolean) => {
    resetPagination();
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: bool }));
  };

  const filterSelected = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters]
  );

  const { data: transactions, isLoading } = useTxsByAddressPagination(
    undefined,
    accountId,
    "",
    filters,
    isSigner,
    offset,
    onViewMore ? 5 : pageSize
  );

  const onPageChange = (nextPage: number) => {
    refetchTxsCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchTxsCount();
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (failureReason) setPageSize(50);
  }, [failureReason, setPageSize]);
  const isMobile = useMobile();
  return (
    <Box mt={{ base: 4, md: 8 }}>
      <TxsTop
        title={
          <TxTitle
            onViewMore={onViewMore}
            failureReason={failureReason}
            txsCount={txsCount}
          />
        }
        onViewMore={onViewMore}
        relationSelection={
          <TxRelationSelection
            setValue={(value: Option<boolean>) => {
              resetPagination();
              setIsSigner(value);
            }}
            w={{ base: "full", md: "200px" }}
            size={{ base: "md", md: "lg" }}
          />
        }
        txTypeSelection={
          <TxFilterSelection
            result={filterSelected}
            setResult={handleSetFilters}
            boxWidth={{ base: "full", md: "285px" }}
            placeholder="All"
            size={{ base: "md", md: "lg" }}
            tagSize={{ base: "sm", md: "md" }}
          />
        }
      />
      {Boolean(failureReason) && transactions?.length && <TxsAlert />}
      <TxsBody
        transactions={transactions}
        isLoading={isLoading || txsCountLoading}
        emptyState={
          <EmptyState
            withBorder
            {...getEmptyStateProps(filterSelected, transactions)}
          />
        }
        showRelations
        onViewMore={onViewMore}
      />
      {!!txsCount &&
        Boolean(transactions?.length) &&
        (onViewMore
          ? txsCount > 5 && !isMobile && <ViewMore onClick={onViewMore} />
          : txsCount > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={txsCount}
                scrollComponentId={scrollComponentId}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            ))}
    </Box>
  );
};
