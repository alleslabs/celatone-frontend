import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  InputGroup,
  InputRightElement,
  Icon,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Select,
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { ChangeEvent } from "react";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  MdArrowDropDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdSearch,
} from "react-icons/md";

import { usePaginator } from "lib/app-provider/hooks/usePaginator";
import { ConnectWalletBtn } from "lib/components/button/ConnectWallet";
import { Loading } from "lib/components/Loading";
import { Next, Paginator, Previous } from "lib/components/pagination";
import type { Transaction } from "lib/types/tx/transaction";

import { FalseState } from "./components/FalseState";
import PastTxTable from "./components/PastTxTable";
import { useTxQuery } from "./query/useTxQuery";

const PastTxs = () => {
  const [input, setInput] = useState("");

  // TODO Combine state
  const [uploadButton, setUploadButton] = useState(false);
  const [instantiateButton, setInstantiateButton] = useState(false);
  const [executeButton, setExecuteButton] = useState(false);
  const [ibcButton, setIbcButton] = useState(false);
  const [sendButton, setSendButton] = useState(false);

  const [data, setData] = useState<Transaction[]>();
  const [totalData, setTotalData] = useState<number>();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: totalData,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { address } = useWallet();
  const {
    data: txData,
    refetch: refetchTxData,
    error: txDataError,
    isLoading: isTxDataLoading,
  } = useTxQuery(
    address,
    executeButton,
    instantiateButton,
    uploadButton,
    ibcButton,
    sendButton,
    input,
    pageSize,
    offset
  );

  // TODO Refactor useEffect
  // Set data and total number of data when new data is passed
  useEffect(() => {
    if (txData) {
      setData(txData.transactions);
      setTotalData(txData.count);
    }
  }, [txData]);

  // Refetch data
  useEffect(() => {
    refetchTxData();
  }, [
    uploadButton,
    instantiateButton,
    executeButton,
    ibcButton,
    sendButton,
    address,
    pageSize,
    offset,
    refetchTxData,
  ]);

  // When buttons are pressed, move back to the first page
  useEffect(() => {
    setCurrentPage(1);
  }, [
    executeButton,
    instantiateButton,
    ibcButton,
    sendButton,
    uploadButton,
    pageSize,
    setCurrentPage,
  ]);

  // Auto search when text input is filled after a period of time
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetchTxData();
    }, 600);
    // Move back to the first page
    setCurrentPage(1);
    return () => clearTimeout(timeoutId);
  }, [input, refetchTxData, setCurrentPage]);

  // Display each row in table
  const displayRow = useMemo(() => {
    const displayComponents: JSX.Element[] = [];
    if (data) {
      data.forEach((element) => {
        displayComponents.push(
          <PastTxTable key={element.hash} element={element} />
        );
      });
    }
    return displayComponents;
  }, [data]);

  // Set input field
  const onChangeSearch = (value: string) => {
    setInput(value);
  };

  // Page change
  const handlePageChange = useCallback(
    (nextPage: number) => {
      setCurrentPage(nextPage);
    },
    [setCurrentPage]
  );

  // Page Sizing
  const handlePageSizeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const size = Number(e.target.value);
      setPageSize(size);
    },
    [setPageSize]
  );

  // Determine which component should be shown
  const displayContent = useMemo(() => {
    const isSomeButtonPressed =
      executeButton ||
      instantiateButton ||
      uploadButton ||
      sendButton ||
      ibcButton;
    if (!address) {
      return (
        <>
          <Flex mb="15px" alignItems="center">
            <ConnectWalletBtn />
            <Text variant="body1" color="text.dark" ml="10px">
              to see your past transactions.
            </Text>
          </Flex>
          <Flex direction="column" align="center">
            <Text variant="body1" color="text.dark">
              Past transactions involving with Wasm module
            </Text>
            <Text variant="body1" color="text.dark">
              such as Instantiate, Execute, or Upload WASM file will display
              here.
            </Text>
          </Flex>
        </>
      );
    }
    // Loading state
    if (isTxDataLoading) {
      return <Loading />;
    }
    // No data found
    if (
      (data?.length === 0 && (input !== "" || isSomeButtonPressed)) ||
      txDataError
    ) {
      return (
        <FalseState
          icon="off"
          text1="No past transaction matches found with your input."
          text2="You can search with transaction hash, and contract address."
        />
      );
    }

    // No input data to search
    if (data?.length === 0) {
      return (
        <FalseState
          icon="on"
          text1="Past transactions involving with Wasm module"
          text2="such as Instantiate, Execute, or Upload WASM file will display here."
        />
      );
    }

    // Data found, display table
    return (
      <>
        <TableContainer w="full">
          <Table px="48px">
            <Thead>
              <Tr
                color="text.dark"
                sx={{
                  "& th:first-of-type": { pl: "48px", pr: "0" },
                  "& td:last-child": { pr: "48px" },
                }}
              >
                <Th textTransform="none" w="15%">
                  Tx Hash
                </Th>
                <Th w="5%" />
                <Th textTransform="none" w="50%">
                  Messages
                </Th>
                <Th textTransform="none" w="25%">
                  Time Stamp
                </Th>
                <Th w="10%" />
                <Th w="5%" />
              </Tr>
            </Thead>
            <Tbody>{displayRow}</Tbody>
          </Table>
        </TableContainer>
        <Box my="15px">
          <Paginator
            onPageChange={handlePageChange}
            currentPage={currentPage}
            pagesQuantity={pagesQuantity}
          >
            <Flex align="center" justify="center" w="full" p={4}>
              <Text variant="body3" color="text.dark">
                Items per page:
              </Text>
              <Select
                border="none"
                w="70px"
                fontSize="12px"
                focusBorderColor="none"
                icon={<MdArrowDropDown />}
                onChange={handlePageSizeChange}
                cursor="pointer"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
              <Text variant="body3" mx="30px">
                {offset + 1} -{" "}
                {currentPage !== pagesQuantity && totalData
                  ? pageSize * currentPage
                  : totalData}{" "}
                of {totalData}
              </Text>
              <Previous variant="unstyled" display="flex">
                <Icon as={MdKeyboardArrowLeft} w={5} h={5} color="gray.600" />
              </Previous>
              <Next variant="unstyled" display="flex">
                <Icon as={MdKeyboardArrowRight} w={5} h={5} color="gray.600" />
              </Next>
            </Flex>
          </Paginator>
        </Box>
      </>
    );
  }, [
    address,
    currentPage,
    data?.length,
    displayRow,
    executeButton,
    handlePageChange,
    handlePageSizeChange,
    ibcButton,
    input,
    instantiateButton,
    isTxDataLoading,
    offset,
    pageSize,
    pagesQuantity,
    sendButton,
    totalData,
    txDataError,
    uploadButton,
  ]);

  return (
    <Box>
      <Box p="48px">
        <Heading variant="h5" as="h5" color="primary.400">
          Past Transactions
        </Heading>
        <Flex mt="48px">
          <Flex grow="2" mr="30px">
            <InputGroup>
              <Input
                value={input}
                onChange={(e) => onChangeSearch(e.target.value)}
                placeholder="Search with transaction hash or contract address"
                focusBorderColor="primary.main"
                h="full"
              />
              <InputRightElement pointerEvents="none" h="full">
                <Icon as={MdSearch} w={5} h={5} color="gray.600" />
              </InputRightElement>
            </InputGroup>
          </Flex>

          <Box>
            <Text variant="body3" mb="8px">
              Filter by actions
            </Text>
            <Flex direction="row" justifyContent="space-between">
              <Button
                // eslint-disable-next-line sonarjs/no-duplicate-string
                variant={sendButton ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setSendButton(!sendButton)}
              >
                Send
              </Button>
              <Button
                variant={uploadButton ? "primary" : "outline-primary"}
                size="sm"
                mx="8px"
                onClick={() => setUploadButton(!uploadButton)}
              >
                Upload
              </Button>
              <Button
                variant={instantiateButton ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setInstantiateButton(!instantiateButton)}
              >
                Instantiate
              </Button>
              <Button
                variant={executeButton ? "primary" : "outline-primary"}
                size="sm"
                mx="8px"
                onClick={() => setExecuteButton(!executeButton)}
              >
                Execute
              </Button>
              <Button
                variant={ibcButton ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setIbcButton(!ibcButton)}
              >
                IBC Layers
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Flex direction="column" align="center">
        {displayContent}
      </Flex>
    </Box>
  );
};

export default PastTxs;
