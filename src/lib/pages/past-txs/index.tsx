import {
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTableWithWallet } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useAccountId } from "lib/services/accountService";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
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
  const router = useRouter();
  const { address } = useWallet();

  const defaultValues: PastTxsState = {
    search: "",
    filters: DEFAULT_TX_FILTERS,
    isSigner: undefined,
  };

  const { watch, setValue } = useForm({
    defaultValues,
    mode: "all",
  });

  const pastTxsState = watch();

  const { data: accountId } = useAccountId(address as HumanAddr);
  const { data: countTxs = 0 } = useTxsCountByAddress(
    undefined,
    accountId,
    pastTxsState.search,
    pastTxsState.filters,
    pastTxsState.isSigner
  );

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
    undefined,
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
    if (router.isReady) AmpTrack(AmpEvent.TO_PAST_TXS);
  }, [router.isReady]);

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
            onChange={(e) => {
              setCurrentPage(1);
              setValue("search", e.target.value);
            }}
            placeholder="Search with transaction hash or contract address"
            h="full"
          />
          <InputRightElement pointerEvents="none" h="full" mr="1">
            <CustomIcon name="search" color="gray.600" />
          </InputRightElement>
        </InputGroup>
        <Flex gap={3}>
          <TxRelationSelection
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
          !pastTxsState.search.trim().length || !filterSelected.length ? (
            <EmptyState
              imageVariant="not-found"
              message={`
      No past transaction matches found with your input.
      You can search with transaction hash, and contract address.
      `}
            />
          ) : (
            <EmptyState
              imageVariant="empty"
              message={`
    Past transactions will display here.
    `}
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
