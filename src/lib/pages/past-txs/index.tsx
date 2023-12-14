import {
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { isNull } from "lodash";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain, useWasmConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTableWithWallet } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import {
  useAPITxsCountByAddress,
  useTxsByAddress,
} from "lib/services/txService";
import type { HumanAddr, Option, TxFilters } from "lib/types";

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

  const { data: rawTxCount } = useAPITxsCountByAddress(
    address as HumanAddr,
    pastTxsState.search,
    pastTxsState.isSigner,
    pastTxsState.filters
  );
  const txCount = isNull(rawTxCount) ? undefined : rawTxCount;

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
    address as HumanAddr,
    pastTxsState.search,
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

  const filterSelected = useMemo(
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
        <InputGroup>
          <Input
            value={pastTxsState.search}
            onChange={handleOnSearchChange}
            placeholder={`Search with Transaction Hash${
              wasm.enabled ? " or Contract Address" : ""
            }`}
            h="full"
          />
          <InputRightElement pointerEvents="none" h="full" mr={1}>
            <CustomIcon name="search" color="gray.600" />
          </InputRightElement>
        </InputGroup>
        <Flex gap={3}>
          <TxRelationSelection
            value={pastTxsState.isSigner}
            setValue={handleOnIsSignerChange}
            w="165px"
          />
          <TxFilterSelection
            result={filterSelected}
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
          filterSelected.length > 0 ? (
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
          onPageChange={setCurrentPage}
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

export default PastTxs;
