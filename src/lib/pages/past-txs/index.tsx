import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain, useWasmConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTableWithWallet } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useDebounce } from "lib/hooks";
import { useTxsByAddress, useTxsCountByAddress } from "lib/services/txService";
import type { Option, TxFilters } from "lib/types";

interface PastTxsState {
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}

const PastTxs = () => {
  const router = useRouter();
  const {
    address,
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const wasm = useWasmConfig({ shouldRedirect: false });

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
    offset,
    pageSize
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
    if (router.isReady) track(AmpEvent.TO_PAST_TXS);
  }, [router.isReady]);

  useEffect(() => {
    reset();
  }, [chainId, address, reset]);

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
        <UserDocsLink isButton href="general/transaction/past-txs" />
      </Flex>
      <Flex my={8} gap={3}>
        <InputWithIcon
          placeholder={`Search with Transaction Hash${
            wasm.enabled ? " or Contract Address" : ""
          }`}
          value={pastTxsState.search}
          onChange={handleOnSearchChange}
          size={{ base: "md", md: "lg" }}
          amptrackSection="past-txs-search"
        />
        <Flex gap={3}>
          <TxRelationSelection
            value={pastTxsState.isSigner}
            setValue={handleOnIsSignerChange}
            w="165px"
          />
          <TxFilterSelection
            result={selectedFilters}
            setResult={handleOnFiltersChange}
            boxWidth="285px"
            placeholder="All"
          />
        </Flex>
      </Flex>
      <TransactionsTableWithWallet
        transactions={txs?.items}
        isLoading={isLoading}
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
      />
      {!!txCount && txCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={txCount}
          pageSize={pageSize}
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

export default PastTxs;
