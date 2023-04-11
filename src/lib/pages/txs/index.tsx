import { Flex, Heading, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useChainId } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useTxs, useTxsCount } from "lib/services/txService";

const Txs = () => {
  const chainId = useChainId();
  const { data: countTxs = 0 } = useTxsCount();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: countTxs,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: txs, isLoading } = useTxs(offset, pageSize);

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
  }, [chainId, setCurrentPage, setPageSize]);

  return (
    <PageContainer>
      <Flex direction="column" gap={2} mb={10}>
        <Heading variant="h5" as="h5">
          Transactions
        </Heading>
        <Text variant="body2" color="text.dark">
          This page displays all transactions in this network sorted by recency
        </Text>
      </Flex>
      <TransactionsTable
        transactions={txs}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            withBorder
            imageVariant="empty"
            message="There are no transactions in this network."
          />
        }
        showAction={false}
        showRelations={false}
      />
      {countTxs > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={countTxs}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </PageContainer>
  );
};

export default Txs;
