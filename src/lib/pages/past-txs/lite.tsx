import { Flex, Heading } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { useCurrentChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTableWithWallet } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useDebounce } from "lib/hooks";
import { useTxsByAddressLcd } from "lib/services/tx";

interface PastTxsLiteTransactionsTableWithWalletEmptyStateProps {
  error: unknown;
  search: string;
}

const PastTxsLiteTransactionsTableWithWalletEmptyState = ({
  error,
  search,
}: PastTxsLiteTransactionsTableWithWalletEmptyStateProps) => {
  if (search.trim().length > 0)
    return (
      <EmptyState
        imageVariant="not-found"
        message="No past transaction matches found with your input. You can search with transaction hash"
        withBorder
      />
    );

  if (error) return <ErrorFetching dataName="transactions" />;

  return (
    <EmptyState
      imageVariant="empty"
      message="Past transactions will display here."
      withBorder
    />
  );
};

export const PastTxsLite = () => {
  const { address, chainId } = useCurrentChain();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

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

  const { data, error, isLoading } = useTxsByAddressLcd(
    address,
    debouncedSearch,
    pageSize,
    offset,
    {
      enabled: !!address,
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  const handleOnSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setSearch("");
  }, [chainId, address]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, setCurrentPage]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Past Transactions" />
      <Flex alignItems="center" justifyContent="space-between">
        <Heading
          alignItems="center"
          as="h5"
          display="flex"
          minH="36px"
          variant="h5"
        >
          Past Transactions
        </Heading>
        <UserDocsLink isButton href="general/transactions/past-txs" />
      </Flex>
      <Flex my={8}>
        <InputWithIcon
          size={{ base: "md", md: "lg" }}
          value={search}
          amptrackSection="past-txs-search"
          onChange={handleOnSearchChange}
          placeholder="Search with Transaction Hash"
        />
      </Flex>
      <TransactionsTableWithWallet
        emptyState={
          <PastTxsLiteTransactionsTableWithWalletEmptyState
            search={search}
            error={error}
          />
        }
        isLoading={isLoading}
        showActions={false}
        showRelations={false}
        transactions={data?.items}
      />
      {!!data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={(nextPage) => setCurrentPage(nextPage)}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalData={data.total}
        />
      )}
    </PageContainer>
  );
};
