import { ButtonGroup, Flex, Spacer, Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
} from "lib/app-provider";
import { SubmitButton } from "lib/components/button";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/copy";
import JsonInput from "lib/components/json/JsonInput";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useQueryCmds } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { queryData } from "lib/services/contract";
import type { ContractAddr, HumanAddr, RpcQueryError } from "lib/types";
import {
  jsonPrettify,
  jsonValidate,
  jsonLineCount,
  encode,
  getCurrentDate,
} from "lib/utils";

const WasmCodeSnippet = dynamic(
  () => import("lib/components/modal/WasmCodeSnippet"),
  {
    ssr: false,
  }
);

interface JsonQueryProps {
  contractAddress: ContractAddr;
  initialMsg: string;
}

export const JsonQuery = ({ contractAddress, initialMsg }: JsonQueryProps) => {
  const { track, trackAction } = useTrack();
  const { isFetching: cmdsFetching, queryCmds } = useQueryCmds(contractAddress);
  const lcdEndpoint = useBaseApiRoute("rest");
  const { addActivity } = useContractStore();
  const { address } = useCurrentChain();

  const [msg, setMsg] = useState("");
  const [res, setRes] = useState("");

  useEffect(() => setMsg(initialMsg), [initialMsg]);
  // TODO: Abstract query
  const {
    refetch,
    isFetching: queryFetching,
    isRefetching: queryRefetching,
  } = useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_QUERY, lcdEndpoint, contractAddress, msg],
    async () => queryData(lcdEndpoint, contractAddress, msg),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      onSettled() {
        setMsg(jsonPrettify(msg));
      },
      onSuccess(data) {
        setRes(JSON.stringify(data.data, null, 2));
        addActivity({
          type: "query",
          action: Object.keys(JSON.parse(msg))[0] ?? "Unknown",
          sender: address as HumanAddr,
          contractAddress,
          msg: encode(msg),
          timestamp: getCurrentDate(),
        });
      },
      onError(err: AxiosError<RpcQueryError>) {
        setRes(err.response?.data.message || DEFAULT_RPC_ERROR);
      },
    }
  );

  const handleQuery = () => {
    trackAction(AmpEvent.ACTION_QUERY, "json-input");
    refetch();
  };

  const isButtonDisabled = jsonValidate(msg) !== null;
  return (
    <>
      {cmdsFetching && <LoadingOverlay />}
      <Box width="full" mb={8} alignItems="center">
        {contractAddress && (
          <Text variant="body3" mb={2}>
            Message Suggestions:
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
          <JsonInput topic="Query Msg" text={msg} setText={setMsg} />
          <Flex align="center" justify="space-between" gap={{ base: 1, md: 0 }}>
            <Flex gap={{ base: 1, md: 2 }}>
              <CopyButton
                isDisable={!msg.length}
                value={msg}
                amptrackSection="query_msg"
              />
              <WasmCodeSnippet
                type="query"
                contractAddress={contractAddress}
                message={msg}
              />
            </Flex>
            <SubmitButton
              text="Query"
              isLoading={queryFetching || queryRefetching}
              onSubmit={handleQuery}
              isDisabled={isButtonDisabled}
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
            topic="Return Output"
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
