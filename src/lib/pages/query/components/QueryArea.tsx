import { Box, Flex, Spacer, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useLCDEndpoint, useMobile } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import JsonInput from "lib/components/json/JsonInput";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useUserKey } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { AmpTrack, AmpEvent } from "lib/services/amplitude";
import { queryData } from "lib/services/contract";
import type { ContractAddr, HumanAddr, RpcQueryError } from "lib/types";
import {
  encode,
  getCurrentDate,
  jsonLineCount,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";

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
  const endpoint = useLCDEndpoint();
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
    AmpTrack(AmpEvent.ACTION_QUERY);
    refetch();
  };

  useEffect(() => setMsg(initialMsg), [initialMsg]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      // TODO: problem with safari if focusing in the textarea
      if (e.ctrlKey && e.key === "Enter") handleQuery();
    };
    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  const isMobile = useMobile();
  return (
    <Flex direction="column">
      <Box width="full" mt={4} mb={8} alignItems="center">
        {contractAddress && (
          <Text variant="body3" mb={2}>
            Message Suggestions:
          </Text>
        )}
        {cmds.length ? (
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
            {cmds.sort().map(([cmd, queryMsg]) => (
              <ContractCmdButton
                key={`query-cmd-${cmd}`}
                cmd={cmd}
                onClickCmd={() => {
                  AmpTrack(AmpEvent.USE_CMD_QUERY);
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
              size={{ base: "sm", md: "md" }}
              onClick={handleQuery}
              isDisabled={jsonValidate(msg) !== null}
              isLoading={isFetching || isRefetching}
              leftIcon={<CustomIcon name="query" />}
            >
              Query {!isMobile && "(Ctrl + Enter)"}
            </Button>
          </Flex>
        </Box>
        <Spacer />
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
    </Flex>
  );
};
