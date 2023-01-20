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
import type { ChangeEvent } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { MdSearch } from "react-icons/md";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";

import { FilterSelection } from "./components/FilterSelection";
import { PastTxsContent } from "./components/PastTxsContent";
import { useTxQuery, useTxQueryCount } from "./query/useTxQuery";

const PastTxs = () => {
  const { address } = useWallet();

  const { watch, setValue } = useForm({
    defaultValues: {
      input: "",
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
    pastTxsState.input,
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
    address,
    pastTxsState.input,
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
    const filters: string[] = [];
    Object.keys(pastTxsState.filters).forEach((key) => {
      if (pastTxsState.filters[key as keyof typeof pastTxsState.filters]) {
        filters.push(key);
      }
    });
    return filters;
  }, [pastTxsState]);

  return (
    <Box>
      <Box px="48px" pt="48px">
        <Heading variant="h5" as="h5" color="primary.400">
          Past Transactions
        </Heading>

        <Flex mt="48px">
          <Flex grow="2" gap="4">
            <InputGroup>
              <Input
                value={pastTxsState.input}
                onChange={(e) => setValue("input", e.target.value)}
                placeholder="Search with transaction hash or contract address"
                focusBorderColor="primary.main"
                h="full"
              />
              <InputRightElement pointerEvents="none" h="full">
                <Icon as={MdSearch} w="5" h="5" color="gray.600" />
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
        input={pastTxsState.input}
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
