import { Flex, Heading } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import { useCurrentChain, useWasmConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTableWithWallet } from "lib/components/table";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useDebounce } from "lib/hooks";
import { useTxsByAddressLcd } from "lib/services/tx";

export const PastTxsLite = () => {
  const wasm = useWasmConfig({ shouldRedirect: false });
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

  const { data, isLoading, error } = useTxsByAddressLcd(
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

  const handleTransactionTableWithWalletEmptyState = useCallback(() => {
    if (search.trim().length > 0)
      return (
        <EmptyState
          imageVariant="not-found"
          message={`No past transaction matches found with your input. You can search with transaction hash${
            wasm.enabled ? ", and contract address" : ""
          }.`}
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
  }, [search, error, wasm]);

  return (
    <PageContainer>
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
          placeholder={`Search with Transaction Hash${
            wasm.enabled ? " or Contract Address" : ""
          }`}
          value={search}
          onChange={handleOnSearchChange}
          size={{ base: "md", md: "lg" }}
          amptrackSection="past-txs-search"
        />
      </Flex>
      <TransactionsTableWithWallet
        transactions={data?.items}
        isLoading={isLoading}
        emptyState={handleTransactionTableWithWalletEmptyState()}
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
