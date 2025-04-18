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
  useContractQueryMsgsRest,
  useContractQueryRest,
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
    useContractQueryMsgsRest(contractAddress);
  const { addActivity } = useContractStore();
  const { address } = useCurrentChain();

  const [msg, setMsg] = useState("");
  const [res, setRes] = useState("");

  useEffect(() => {
    setMsg(initialMsg);
    setRes("");
  }, [contractAddress, initialMsg]);

  const { refetch, isFetching } = useContractQueryRest(contractAddress, msg, {
    enabled: false,
    retry: false,
    cacheTime: 0,
    onSettled: () => setMsg(jsonPrettify(msg)),
    onSuccess: (data) => {
      setRes(JSON.stringify(data, null, 2));
      addActivity({
        type: "query",
        action: Object.keys(JSON.parse(msg))[0] ?? "Unknown",
        sender: address,
        contractAddress,
        msg: encode(msg),
        timestamp: getCurrentDate(),
      });
    },
    onError: (err) =>
      setRes(
        (err as AxiosError<RpcQueryError>).response?.data.message ||
          DEFAULT_RPC_ERROR
      ),
  });

  const handleQuery = () => {
    trackActionQuery(AmpEvent.ACTION_QUERY, "json-input", true);
    refetch();
  };

  const isButtonDisabled = jsonValidate(msg) !== null;
  return (
    <>
      {isCmdsFetching && <LoadingOverlay />}
      <Box width="full" mb={8} alignItems="center">
        {contractAddress && (
          <Text variant="body3" mb={2}>
            Message suggestions:
          </Text>
        )}
        {queryCmds.length ? (
          <ButtonGroup
            width="90%"
            flexWrap="wrap"
            rowGap={2}
            sx={{
              "> button": {
                marginInlineStart: "0 !important",
                marginInlineEnd: "1",
              },
            }}
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
          <JsonInput topic="Query msg" text={msg} setText={setMsg} />
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            alignItems="center"
            gap={{ base: 1, md: 0 }}
          >
            <Grid
              w={{ base: "full", md: "auto" }}
              columnGap={2}
              mb={{ base: 2, md: 0 }}
              templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
            >
              <CopyButton
                w="full"
                isDisable={!msg.length}
                value={msg}
                amptrackSection="query_msg"
              />
              <WasmCodeSnippet
                w="full"
                type="query"
                contractAddress={contractAddress}
                message={msg}
              />
              {isMobile && (
                <Button
                  variant="outline-white"
                  size="sm"
                  background="background.main"
                  isDisabled={isButtonDisabled}
                  onClick={() => setMsg(jsonPrettify(msg))}
                >
                  Format JSON
                </Button>
              )}
            </Grid>
            <SubmitButton
              text="Query"
              isLoading={isFetching}
              onSubmit={handleQuery}
              isDisabled={isButtonDisabled}
              isFullWidth={isMobile}
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
            topic="Return output"
            text={res}
            canCopy={res.length !== 0}
          />
          {/* If response line count > 100, the copy button is visible. */}
          {jsonLineCount(res) > 100 && (
            <Flex justifyContent="flex-end" mt={4}>
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
