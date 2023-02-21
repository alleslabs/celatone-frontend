import {
  Box,
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

import { CustomIcon } from "lib/components/icon/CustomIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { HumanAddr } from "lib/types";

import { FilterSelection } from "./components/FilterSelection";
import { PastTxsContent } from "./components/PastTxsContent";
import { useTxQuery, useTxQueryCount } from "./query/useTxQuery";

const PastTxs = () => {
  const router = useRouter();
  const { address } = useWallet();

  const { watch, setValue } = useForm({
    defaultValues: {
      search: "",
      filters: {
        isExecute: false,
        isInstantiate: false,
        isUpload: false,
        isIbc: false,
        isSend: false,
        isMigrate: false,
        isUpdateAdmin: false,
        isClearAdmin: false,
      },
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
    <Box>
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
              <InputRightElement pointerEvents="none" h="full" mr="1">
                <CustomIcon name="search" />
              </InputRightElement>
            </InputGroup>
            <FilterSelection
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
    </Box>
  );
};

export default PastTxs;
