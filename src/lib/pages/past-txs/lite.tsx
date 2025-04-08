import type { ChangeEvent } from "react";

import { Flex, Heading } from "@chakra-ui/react";
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
import { useTxsByAddressRest } from "lib/services/tx";
import { useEffect, useState } from "react";

interface PastTxsLiteTransactionsTableWithWalletEmptyStateProps {
  search: string;
  error: unknown;
}

const PastTxsLiteTransactionsTableWithWalletEmptyState = ({
  search,
  error,
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

  const { data, isLoading, error } = useTxsByAddressRest(
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
        <UserDocsLink href="general/transactions/past-txs" isButton />
      </Flex>
      <Flex my={8}>
        <InputWithIcon
          amptrackSection="past-txs-search"
          placeholder="Search with transaction hash"
          size={{ base: "md", md: "lg" }}
          value={search}
          onChange={handleOnSearchChange}
        />
      </Flex>
      <TransactionsTableWithWallet
        emptyState={
          <PastTxsLiteTransactionsTableWithWalletEmptyState
            error={error}
            search={search}
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
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={data.total}
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
