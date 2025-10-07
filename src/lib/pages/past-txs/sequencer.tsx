import { Flex, Heading } from "@chakra-ui/react";
import { useCurrentChain, useEvmConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTableWithWalletSequencer } from "lib/components/table";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { CosmosEvmTxsTab, useDebounce } from "lib/hooks";
import { useEvmTxsByAccountAddressSequencer } from "lib/services/evm-txs";
import { useTxsByAddressSequencer } from "lib/services/tx";
import { useEffect, useState } from "react";

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
  const evm = useEvmConfig({ shouldRedirect: false });
  const { address, chainId } = useCurrentChain();
  const [currentTab, setCurrentTab] = useState(CosmosEvmTxsTab.Evm);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const cosmosTxsData = useTxsByAddressSequencer(address, debouncedSearch, 10);
  const evmTxsData = useEvmTxsByAccountAddressSequencer(
    address,
    debouncedSearch,
    10
  );

  useEffect(() => {
    setSearch("");
  }, [chainId, address]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Past transactions" />
      <Flex alignItems="center" justifyContent="space-between">
        <Heading
          alignItems="center"
          as="h5"
          display="flex"
          minH="36px"
          variant="h5"
        >
          Past transactions
        </Heading>
        {evm.enabled && (
          <TypeSwitch
            currentTab={currentTab}
            disabledScrollToTop
            tabs={Object.values(CosmosEvmTxsTab)}
            onTabChange={setCurrentTab}
          />
        )}
      </Flex>
      <Flex my={8}>
        <InputWithIcon
          amptrackSection="past-txs-search"
          placeholder="Search with transaction hash"
          size={{ base: "md", md: "lg" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Flex>
      <TransactionsTableWithWalletSequencer
        cosmosData={{
          data: cosmosTxsData,
          emptyMessage: (
            <PastTxsSequencerTransactionsTableWithWalletEmptyState
              error={cosmosTxsData.error}
              search={search}
            />
          ),
        }}
        currentTab={currentTab}
        evmData={{
          emptyMessage: (
            <PastTxsSequencerTransactionsTableWithWalletEmptyState
              error={evmTxsData.error}
              search={search}
            />
          ),
          evmTxsData,
        }}
      />
    </PageContainer>
  );
};
