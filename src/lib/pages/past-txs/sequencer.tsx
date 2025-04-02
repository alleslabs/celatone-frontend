import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useCurrentChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import PageContainer from "lib/components/PageContainer";
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
  const { address, chainId } = useCurrentChain();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useTxsByAddressSequencer(address, debouncedSearch);

  useEffect(() => {
    setSearch("");
  }, [chainId, address]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Past transactions" />
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
          placeholder="Search with transaction hash"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size={{ base: "md", md: "lg" }}
          amptrackSection="past-txs-search"
        />
      </Flex>
      <TransactionsTableWithWallet
        transactions={data}
        isLoading={isLoading}
        emptyState={
          <PastTxsSequencerTransactionsTableWithWalletEmptyState
            search={search}
            error={error}
          />
        }
        showActions={false}
        showRelations
      />
      {hasNextPage && (
        <LoadNext
          text="Load more 10 transactions"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </PageContainer>
  );
};
