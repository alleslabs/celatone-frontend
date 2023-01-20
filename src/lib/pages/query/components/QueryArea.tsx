import { SearchIcon } from "@chakra-ui/icons";
import { Box, Flex, Spacer, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/CopyButton";
import JsonInput from "lib/components/json/JsonInput";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractStore, useEndpoint, useUserKey } from "lib/hooks";
import { queryData } from "lib/services/contract";
import type { ContractAddr, RpcQueryError } from "lib/types";
import { encode, jsonPrettify, jsonValidate } from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface QueryAreaProps {
  contractAddress: ContractAddr;
  initialMsg: string;
  cmds: [string, string][];
}

export const QueryArea = ({
  contractAddress,
  initialMsg,
  cmds,
}: QueryAreaProps) => {
  const endpoint = useEndpoint();
  const userKey = useUserKey();
  const { addActivity } = useContractStore();
  const { address } = useWallet();

  const [msg, setMsg] = useState("");
  const [res, setRes] = useState("");

  // TODO: Abstract query
  const { refetch, isFetching, isRefetching } = useQuery(
    ["query", endpoint, contractAddress, msg],
    async () => queryData(endpoint, contractAddress, msg),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      onSettled() {
        setMsg(jsonPrettify(msg));
      },
      onSuccess(data) {
        setRes(JSON.stringify(data.data, null, 2));
        addActivity(userKey, {
          type: "query",
          action: Object.keys(JSON.parse(msg))[0] ?? "Unknown",
          sender: address,
          contractAddress,
          msg: encode(msg),
          timestamp: new Date(),
        });
      },
      onError(err: AxiosError<RpcQueryError>) {
        setRes(err.response?.data.message || DEFAULT_RPC_ERROR);
      },
    }
  );

  useEffect(() => setMsg(initialMsg), [initialMsg]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      // TODO: problem with safari if focusing in the textarea
      if (e.ctrlKey && e.key === "Enter") {
        refetch();
      }
    };
    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  return (
    <Flex direction="column">
      <Flex width="full" my="16px" alignItems="center">
        {cmds.length ? (
          <ButtonGroup
            width="90%"
            flexWrap="wrap"
            rowGap="8px"
            sx={{
              "> button": {
                marginInlineStart: "0 !important",
                marginInlineEnd: "1",
              },
            }}
          >
            {cmds.sort().map(([cmd, queryMsg]) => (
              <ContractCmdButton
                key={`query-cmd-${cmd}`}
                cmd={cmd}
                onClickCmd={() => setMsg(jsonPrettify(queryMsg))}
              />
            ))}
          </ButtonGroup>
        ) : (
          contractAddress && (
            <Text ml="16px" variant="body2" color="text.dark">
              No QueryMsgs suggestion available
            </Text>
          )
        )}
        <Spacer />
        <CopyButton isDisable={res.length === 0} value={res} />
      </Flex>
      <Flex gap="16px">
        <Box w="full">
          <JsonInput
            topic="Query Msg"
            text={msg}
            setText={setMsg}
            height="240px"
          />
          <Flex align="center" justify="space-between">
            <Flex gap={2}>
              <CopyButton isDisable={!msg.length} value={msg} />
              <CodeSnippet
                type="query"
                contractAddress={contractAddress}
                message={msg}
              />
            </Flex>
            <Button
              variant="primary"
              fontSize="14px"
              p="6px 16px"
              onClick={() => {
                refetch();
              }}
              isDisabled={jsonValidate(msg) !== null}
              isLoading={isFetching || isRefetching}
              leftIcon={<SearchIcon />}
            >
              Query (Ctrl + Enter)
            </Button>
          </Flex>
        </Box>
        <Spacer />
        <Box w="full">
          <JsonReadOnly topic="Return Output" text={res} height="240px" />
          <Flex justifyContent="flex-end" gap={2}>
            <CopyButton isDisable={res.length === 0} value={res} />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
