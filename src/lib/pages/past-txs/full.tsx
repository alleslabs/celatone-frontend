import type { Option, TxFilters } from "lib/types";
import type { ChangeEvent } from "react";

import { Flex, Heading } from "@chakra-ui/react";
import { useCurrentChain, useWasmConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state";
import { TransactionsTableWithWallet } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useDebounce } from "lib/hooks";
import { useTxsByAddress, useTxsCountByAddress } from "lib/services/tx";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

interface PastTxsState {
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}

export const PastTxsFull = () => {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const { address, chainId } = useCurrentChain();

  const defaultValues: PastTxsState = {
    search: "",
    filters: DEFAULT_TX_FILTERS,
    isSigner: undefined,
  };

  const { watch, setValue, reset } = useForm({
    defaultValues,
    mode: "all",
  });
  const pastTxsState = watch();
  const debouncedSearch = useDebounce(pastTxsState.search);

  const { data: rawTxCount, refetch: refetchCount } = useTxsCountByAddress(
    address,
    debouncedSearch,
    pastTxsState.isSigner,
    pastTxsState.filters
  );
  const txCount = rawTxCount ?? undefined;

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: txCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: txs, isLoading } = useTxsByAddress(
    address,
    debouncedSearch,
    pastTxsState.isSigner,
    pastTxsState.filters,
    pageSize,
    offset
  );

  const handleOnSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setValue("search", e.target.value);
  };

  const handleOnIsSignerChange = (value: Option<boolean>) => {
    setCurrentPage(1);
    setValue("isSigner", value);
  };

  const handleOnFiltersChange = (filter: string, bool: boolean) => {
    setCurrentPage(1);
    setValue("filters", { ...pastTxsState.filters, [filter]: bool });
  };

  const selectedFilters = useMemo(
    () =>
      Object.keys(pastTxsState.filters).reduce((acc: string[], key: string) => {
        if (pastTxsState.filters[key as keyof typeof pastTxsState.filters]) {
          acc.push(key);
        }
        return acc;
      }, []),
    [pastTxsState]
  );

  useEffect(() => {
    reset();
  }, [chainId, address, reset]);

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
      <Flex gap={3} my={8}>
        <InputWithIcon
          amptrackSection="past-txs-search"
          placeholder={`Search with transaction hash${
            wasm.enabled ? " or contract address" : ""
          }`}
          size={{ base: "md", md: "lg" }}
          value={pastTxsState.search}
          onChange={handleOnSearchChange}
        />
        <Flex gap={3}>
          <TxRelationSelection
            setValue={handleOnIsSignerChange}
            value={pastTxsState.isSigner}
            w="165px"
          />
          <TxFilterSelection
            boxWidth="285px"
            placeholder="All"
            result={selectedFilters}
            setResult={handleOnFiltersChange}
          />
        </Flex>
      </Flex>
      <TransactionsTableWithWallet
        emptyState={
          pastTxsState.search.trim().length > 0 ||
          pastTxsState.isSigner !== undefined ||
          selectedFilters.length > 0 ? (
            <EmptyState
              imageVariant="not-found"
              message={`No past transaction matches found with your input. You can search with transaction hash${
                wasm.enabled ? ", and contract address" : ""
              }.`}
              withBorder
            />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="Past transactions will display here."
              withBorder
            />
          )
        }
        isLoading={isLoading}
        showActions
        showRelations
        transactions={txs?.items}
      />
      {!!txCount && txCount > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={txCount}
          onPageChange={(nextPage) => {
            setCurrentPage(nextPage);
            refetchCount();
          }}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
            refetchCount();
          }}
        />
      )}
    </PageContainer>
  );
};
