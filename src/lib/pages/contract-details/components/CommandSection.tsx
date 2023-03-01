import { ButtonGroup, Flex, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useInternalNavigate } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { useExecuteCmds, useQueryCmds } from "lib/hooks";
import type { ContractAddr } from "lib/types";
import { encode, getFirstQueryParam, jsonPrettify } from "lib/utils";

export const CommandSection = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const contractAddress = getFirstQueryParam(
    router.query.contractAddress
  ) as ContractAddr;

  const { isFetching: isQueryCmdsFetching, queryCmds } =
    useQueryCmds(contractAddress);

  const { isFetching: isExecuteCmdsFetching, execCmds } =
    useExecuteCmds(contractAddress);

  const renderCmds = (
    isFetching: boolean,
    cmds: [string, string][],
    type: string
  ) => {
    if (isFetching) {
      return <Spinner color="pebble.600" size="md" mx={1} />;
    }
    if (cmds.length) {
      return (
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
          {cmds.sort().map(([cmd, msg]) => (
            <ContractCmdButton
              key={`${type}-cmd-${cmd}`}
              cmd={cmd}
              onClickCmd={() => {
                navigate({
                  pathname: `/${type}`,
                  query: {
                    contract: contractAddress,
                    msg: encode(jsonPrettify(msg)),
                  },
                });
              }}
            />
          ))}
        </ButtonGroup>
      );
    }
    return (
      <Text variant="body2" color="text.dark">
        No messages available
      </Text>
    );
  };

  return (
    <Flex gap={6}>
      <Flex
        direction="column"
        bg="pebble.900"
        p={4}
        borderRadius="8px"
        flex={0.5}
      >
        <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
          Query Shortcuts
        </Text>
        {renderCmds(isQueryCmdsFetching, queryCmds, "query")}
      </Flex>
      <Flex
        direction="column"
        bg="pebble.900"
        p={4}
        borderRadius="8px"
        flex={0.5}
      >
        <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
          Execute Shortcuts
        </Text>
        {renderCmds(isExecuteCmdsFetching, execCmds, "execute")}
      </Flex>
    </Flex>
  );
};
