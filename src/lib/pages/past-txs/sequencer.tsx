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
import { useTxsByAddressSequencer } from "lib/services/tx";

interface PastTxsSequencerTransactionsTableWithWalletEmptyStateProps {
  search: string;
  error: unknown;
}

const PastTxsSequencerTransactionsTableWithWalletEmptyState = ({
  search,
  error,
}: PastTxsSequencerTransactionsTableWithWalletEmptyStateProps) => {
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

export const PastTxsSequencer = () => {
  const {
    address,
    chain: { chain_id: chainId },
  } = useCurrentChain();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

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

  const { data, isLoading, error } = useTxsByAddressSequencer(
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
      <Flex justifyContent="space-between" alignItems="center">
        <Heading
          variant="h5"
          as="h5"
          minH="36px"
          display="flex"
          alignItems="center"
        >
          Past Transactions
        </Heading>
        <UserDocsLink isButton href="general/transactions/past-txs" />
      </Flex>
      <Flex my={8}>
        <InputWithIcon
          placeholder="Search with Transaction Hash"
          value={search}
          onChange={handleOnSearchChange}
          size={{ base: "md", md: "lg" }}
          amptrackSection="past-txs-search"
        />
      </Flex>
      <TransactionsTableWithWallet
        transactions={data?.items}
        isLoading={isLoading}
        emptyState={
          <PastTxsSequencerTransactionsTableWithWalletEmptyState
            search={search}
            error={error}
          />
        }
        showActions={false}
        showRelations={false}
      />
      {!!data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={data.total}
          pageSize={pageSize}
          onPageChange={(nextPage) => setCurrentPage(nextPage)}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </PageContainer>
  );
};
