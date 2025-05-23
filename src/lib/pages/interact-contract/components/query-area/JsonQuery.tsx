import type { AxiosError } from "axios";
import type { BechAddr32, RpcQueryError } from "lib/types";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track, trackActionQuery } from "lib/amplitude";
import { useCurrentChain, useMobile } from "lib/app-provider";
import { SubmitButton } from "lib/components/button";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/copy";
import JsonInput from "lib/components/json/JsonInput";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractStore } from "lib/providers/store";
import {
  useContractQueryMsgsRest,
  useContractQueryRest,
} from "lib/services/wasm/contract";
import {
  encode,
  getCurrentDate,
  jsonLineCount,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WasmCodeSnippet = dynamic(
  () => import("lib/components/modal/WasmCodeSnippet"),
  {
    ssr: false,
  }
);

interface JsonQueryProps {
  contractAddress: BechAddr32;
  initialMsg: string;
}

export const JsonQuery = ({ contractAddress, initialMsg }: JsonQueryProps) => {
  const isMobile = useMobile();
  const { data: queryCmds = [], isFetching: isCmdsFetching } =
    useContractQueryMsgsRest(contractAddress);
  const { addActivity } = useContractStore();
  const { address } = useCurrentChain();

  const [msg, setMsg] = useState("");
  const [res, setRes] = useState("");

  useEffect(() => {
    setMsg(initialMsg);
    setRes("");
  }, [contractAddress, initialMsg]);

  const { isFetching, refetch } = useContractQueryRest(contractAddress, msg, {
    cacheTime: 0,
    enabled: false,
    onError: (err) =>
      setRes(
        (err as AxiosError<RpcQueryError>).response?.data.message ||
          DEFAULT_RPC_ERROR
      ),
    onSettled: () => setMsg(jsonPrettify(msg)),
    onSuccess: (data) => {
      setRes(JSON.stringify(data, null, 2));
      addActivity({
        action: Object.keys(JSON.parse(msg))[0] ?? "Unknown",
        contractAddress,
        msg: encode(msg),
        sender: address,
        timestamp: getCurrentDate(),
        type: "query",
      });
    },
    retry: false,
  });

  const handleQuery = () => {
    trackActionQuery(AmpEvent.ACTION_QUERY, "json-input", true);
    refetch();
  };

  const isButtonDisabled = jsonValidate(msg) !== null;
  return (
    <>
      {isCmdsFetching && <LoadingOverlay />}
      <Box alignItems="center" mb={8} width="full">
        {contractAddress && (
          <Text mb={2} variant="body3">
            Message suggestions:
          </Text>
        )}
        {queryCmds.length ? (
          <ButtonGroup
            flexWrap="wrap"
            rowGap={2}
            sx={{
              "> button": {
                marginInlineEnd: "1",
                marginInlineStart: "0 !important",
              },
            }}
            width="90%"
          >
            {queryCmds.sort().map(([cmd, queryMsg]) => (
              <ContractCmdButton
                key={`query-cmd-${cmd}`}
                cmd={cmd}
                onClickCmd={() => {
                  track(AmpEvent.USE_CMD_QUERY);
                  setMsg(jsonPrettify(queryMsg));
                }}
              />
            ))}
          </ButtonGroup>
        ) : (
          contractAddress && (
            <Text color="text.dark" my={1} variant="body2">
              No QueryMsgs suggestion available
            </Text>
          )
        )}
      </Box>
      <Flex direction={{ base: "column", md: "row" }} gap={4}>
        <Box w="full">
          <JsonInput setText={setMsg} text={msg} topic="Query msg" />
          <Flex
            alignItems="center"
            direction={{ base: "column", md: "row" }}
            gap={{ base: 1, md: 0 }}
            justify="space-between"
          >
            <Grid
              columnGap={2}
              mb={{ base: 2, md: 0 }}
              templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
              w={{ base: "full", md: "auto" }}
            >
              <CopyButton
                amptrackSection="query_msg"
                isDisable={!msg.length}
                value={msg}
                w="full"
              />
              <WasmCodeSnippet
                contractAddress={contractAddress}
                message={msg}
                type="query"
                w="full"
              />
              {isMobile && (
                <Button
                  background="background.main"
                  isDisabled={isButtonDisabled}
                  size="sm"
                  variant="outline-white"
                  onClick={() => setMsg(jsonPrettify(msg))}
                >
                  Format JSON
                </Button>
              )}
            </Grid>
            <SubmitButton
              isDisabled={isButtonDisabled}
              isFullWidth={isMobile}
              isLoading={isFetching}
              text="Query"
              onSubmit={handleQuery}
            />
          </Flex>
        </Box>
        <Spacer
          border={{ base: "1px solid", md: "0px" }}
          borderColor="gray.700"
          my={4}
        />

        <Box w="full">
          <JsonReadOnly
            canCopy={res.length !== 0}
            text={res}
            topic="Return output"
          />
          {/* If response line count > 100, the copy button is visible. */}
          {jsonLineCount(res) > 100 && (
            <Flex justifyContent="flex-end" mt={4}>
              <CopyButton
                amptrackSection="query_response"
                isDisable={res.length === 0}
                value={res}
              />
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};
