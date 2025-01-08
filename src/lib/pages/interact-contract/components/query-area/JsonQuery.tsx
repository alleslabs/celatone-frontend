import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
  useContractQueryLcd,
  useContractQueryMsgsLcd,
} from "lib/services/wasm/contract";
import type { BechAddr32, RpcQueryError } from "lib/types";
import {
  encode,
  getCurrentDate,
  jsonLineCount,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";

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
    useContractQueryMsgsLcd(contractAddress);
  const { addActivity } = useContractStore();
  const { address } = useCurrentChain();

  const [msg, setMsg] = useState("");
  const [res, setRes] = useState("");

  useEffect(() => {
    setMsg(initialMsg);
    setRes("");
  }, [contractAddress, initialMsg]);

  const { isFetching, refetch } = useContractQueryLcd(contractAddress, msg, {
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
      <Box width="full" alignItems="center" mb={8}>
        {contractAddress && (
          <Text mb={2} variant="body3">
            Message Suggestions:
          </Text>
        )}
        {queryCmds.length ? (
          <ButtonGroup
            width="90%"
            flexWrap="wrap"
            sx={{
              "> button": {
                marginInlineEnd: "1",
                marginInlineStart: "0 !important",
              },
            }}
            rowGap={2}
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
            <Text my={1} variant="body2" color="text.dark">
              No QueryMsgs suggestion available
            </Text>
          )
        )}
      </Box>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <Box w="full">
          <JsonInput setText={setMsg} text={msg} topic="Query Msg" />
          <Flex
            alignItems="center"
            gap={{ base: 1, md: 0 }}
            justify="space-between"
            direction={{ base: "column", md: "row" }}
          >
            <Grid
              mb={{ base: 2, md: 0 }}
              w={{ base: "full", md: "auto" }}
              columnGap={2}
              templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
            >
              <CopyButton
                isDisable={!msg.length}
                value={msg}
                w="full"
                amptrackSection="query_msg"
              />
              <WasmCodeSnippet
                message={msg}
                type="query"
                w="full"
                contractAddress={contractAddress}
              />
              {isMobile && (
                <Button
                  isDisabled={isButtonDisabled}
                  size="sm"
                  variant="outline-white"
                  background="background.main"
                  onClick={() => setMsg(jsonPrettify(msg))}
                >
                  Format JSON
                </Button>
              )}
            </Grid>
            <SubmitButton
              isFullWidth={isMobile}
              isDisabled={isButtonDisabled}
              text="Query"
              isLoading={isFetching}
              onSubmit={handleQuery}
            />
          </Flex>
        </Box>
        <Spacer
          my={4}
          border={{ base: "1px solid", md: "0px" }}
          borderColor="gray.700"
        />

        <Box w="full">
          <JsonReadOnly
            text={res}
            canCopy={res.length !== 0}
            topic="Return Output"
          />
          {/* If response line count > 100, the copy button is visible. */}
          {jsonLineCount(res) > 100 && (
            <Flex mt={4} justifyContent="flex-end">
              <CopyButton
                isDisable={res.length === 0}
                value={res}
                amptrackSection="query_response"
              />
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};
