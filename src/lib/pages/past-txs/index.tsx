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
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { ChangeEvent } from "react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { MdSearch } from "react-icons/md";

import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { DisconnectedState } from "lib/components/state/DisconnectedState";
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
  const [totalData, setTotalData] = useState<number>(0);

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
  const onPageChange = useCallback(
    (nextPage: number) => {
      setCurrentPage(nextPage);
    },
    [setCurrentPage]
  );

  // Page Sizing
  const onPageSizeChange = useCallback(
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
        <Flex
          direction="column"
          borderY="1px solid"
          borderColor="divider.main"
          width="full"
          py="48px"
        >
          <DisconnectedState
            text="to see your past transactions."
            helperText="Past transactions involving the wasm module (storing wasm codes, contract interactions, etc.) will display here."
          />
        </Flex>
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
          text2="such as Instantiate, Execute, or Upload Wasm file will display here."
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
                  Timestamp
                </Th>
                <Th w="10%" />
                <Th w="5%" />
              </Tr>
            </Thead>
            <Tbody>{displayRow}</Tbody>
          </Table>
        </TableContainer>
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </>
    );
  }, [
    address,
    currentPage,
    data?.length,
    displayRow,
    executeButton,
    onPageChange,
    onPageSizeChange,
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
                IBC
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
