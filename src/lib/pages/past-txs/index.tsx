import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, useTrack } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTableWithWallet } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useAccountId } from "lib/services/accountService";
import {
  useTxsByAddressPagination,
  useTxsCountByAddress,
} from "lib/services/txService";
import type { HumanAddr, Option, TxFilters } from "lib/types";

interface PastTxsState {
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}

const PastTxs = () => {
  const { track } = useTrack();
  const router = useRouter();
  const {
    address,
    chain: { chain_id: chainId },
  } = useCurrentChain();

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

  const { data: accountId } = useAccountId(address as HumanAddr);
  const { data: countTxs = 0 } = useTxsCountByAddress({
    accountId,
    search: pastTxsState.search,
    filters: pastTxsState.filters,
    isSigner: pastTxsState.isSigner,
  });

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

  const { data: txs, isLoading } = useTxsByAddressPagination(
    accountId,
    pastTxsState.search,
    pastTxsState.filters,
    pastTxsState.isSigner,
    offset,
    pageSize
  );

  const resetPagination = () => {
    setPageSize(10);
    setCurrentPage(1);
  };

  const setFilter = (filter: string, bool: boolean) => {
    resetPagination();
    setValue("filters", { ...pastTxsState.filters, [filter]: bool });
  };

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  const filterSelected = useMemo(() => {
    return Object.keys(pastTxsState.filters).reduce(
      (acc: string[], key: string) => {
        if (pastTxsState.filters[key as keyof typeof pastTxsState.filters]) {
          acc.push(key);
        }
        return acc;
      },
      []
    );
  }, [pastTxsState]);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PAST_TXS);
  }, [router.isReady, track]);

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
  }, [
    chainId,
    setCurrentPage,
    setPageSize,
    pastTxsState.search,
    pastTxsState.isSigner,
    pastTxsState.filters,
  ]);

  useEffect(() => {
    reset();
  }, [chainId, address, reset]);

  return (
    <PageContainer>
      <Heading
        variant="h5"
        as="h5"
        minH="36px"
        display="flex"
        alignItems="center"
      >
        Past Transactions
      </Heading>
      <Flex my={8} gap={3}>
        <InputWithIcon
          placeholder="Search with Transaction Hash or Contract Address"
          value={pastTxsState.search}
          onChange={(e) => {
            setCurrentPage(1);
            setValue("search", e.target.value);
          }}
          size={{ base: "md", md: "lg" }}
        />
        <Flex gap={3}>
          <TxRelationSelection
            value={pastTxsState.isSigner}
            setValue={(value) => {
              resetPagination();
              setValue("isSigner", value);
            }}
            w="165px"
          />
          <TxFilterSelection
            result={filterSelected}
            setResult={setFilter}
            boxWidth="285px"
            placeholder="All"
          />
        </Flex>
      </Flex>
      <TransactionsTableWithWallet
        transactions={txs}
        isLoading={isLoading}
        emptyState={
          pastTxsState.search.trim().length > 0 ||
          pastTxsState.isSigner !== undefined ||
          filterSelected.length > 0 ? (
            <EmptyState
              imageVariant="not-found"
              message="No past transaction matches found with your input. You can search with transaction hash, and contract address."
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

export default PastTxs;
