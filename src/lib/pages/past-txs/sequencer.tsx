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
  error: unknown;
  search: string;
}

const PastTxsSequencerTransactionsTableWithWalletEmptyState = ({
  error,
  search,
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
    isFetchingNextPage,
    isLoading,
  } = useTxsByAddressSequencer(address, debouncedSearch);

  useEffect(() => {
    setSearch("");
  }, [chainId, address]);

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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search with Transaction Hash"
        />
      </Flex>
      <TransactionsTableWithWallet
        emptyState={
          <PastTxsSequencerTransactionsTableWithWalletEmptyState
            search={search}
            error={error}
          />
        }
        isLoading={isLoading}
        showActions={false}
        showRelations
        transactions={data}
      />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more 10 transactions"
        />
      )}
    </PageContainer>
  );
};
