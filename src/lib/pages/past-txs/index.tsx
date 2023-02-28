import {
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { MdSearch } from "react-icons/md";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useTxQuery, useTxQueryCount } from "lib/services/txQuery/useTxQuery";
import type { HumanAddr } from "lib/types";

import { PastTxsContent } from "./components/PastTxsContent";

const PastTxs = () => {
  const router = useRouter();
  const { address } = useWallet();

  const { watch, setValue } = useForm({
    defaultValues: {
      search: "",
      filters: DEFAULT_TX_FILTERS,
    },
    mode: "all",
  });

  const pastTxsState = watch();

  const { data: countTxs = 0 } = useTxQueryCount(
    address,
    pastTxsState.search,
    pastTxsState.filters
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

  const {
    data: txData,
    error: txDataError,
    isLoading,
  } = useTxQuery(
    address as HumanAddr,
    pastTxsState.search,
    pastTxsState.filters,
    pageSize,
    offset
  );

  const setFilter = (filter: string, bool: boolean) => {
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
    setCurrentPage(1);
  }, [pastTxsState.filters, pastTxsState.search, setCurrentPage]);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PAST_TXS);
  }, [router.isReady]);

  return (
    <>
      <Box px="48px" pt="48px">
        <Heading variant="h5" as="h5">
          Past Transactions
        </Heading>

        <Flex mt="48px">
          <Flex grow="2" gap="4">
            <InputGroup>
              <Input
                value={pastTxsState.search}
                onChange={(e) => setValue("search", e.target.value)}
                placeholder="Search with transaction hash or contract address"
                h="full"
              />
              <InputRightElement pointerEvents="none" h="full">
                <Icon as={MdSearch} w="5" h="5" color="pebble.600" />
              </InputRightElement>
            </InputGroup>
            <TxFilterSelection
              result={filterSelected}
              setResult={setFilter}
              boxWidth="400px"
              placeholder="All"
            />
          </Flex>
        </Flex>
      </Box>
      <PastTxsContent
        isLoading={isLoading}
        txDataError={txDataError}
        input={pastTxsState.search}
        filterSelected={filterSelected}
        txData={txData}
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
    </>
  );
};

export default PastTxs;
