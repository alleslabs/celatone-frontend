import { ButtonGroup, Flex, Spinner, Text } from "@chakra-ui/react";
import router from "next/router";

import { useQueryCmds } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import type { ContractAddr } from "lib/types";
import { encode, getFirstQueryParam, jsonPrettify } from "lib/utils";

export const CommandSection = () => {
  /**
   * @todos
   * - Make an interface
   * - Wireup with real execute commands data
   */
  const contractAddress = getFirstQueryParam(
    router.query.contractAddress
  ) as ContractAddr;

  const { isFetching: isQueryCmdsFetching, queryCmds } = useQueryCmds({
    contractAddress,
  });

  const renderQueryCmds = () => {
    if (isQueryCmdsFetching) {
      return <Spinner color="gray.400" size="md" mx={1} />;
    }
    if (queryCmds.length) {
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
          {queryCmds.map(([cmd, queryMsg]) => (
            <ContractCmdButton
              key={`query-cmd-${cmd}`}
              cmd={cmd}
              onClickCmd={() => {
                router.push({
                  pathname: "/query",
                  query: {
                    contract: contractAddress,
                    msg: encode(jsonPrettify(queryMsg)),
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
        bg="gray.900"
        p={4}
        borderRadius="8px"
        flex={0.5}
      >
        <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
          Query Shortcuts
        </Text>
        {renderQueryCmds()}
      </Flex>
      <Flex
        direction="column"
        bg="gray.900"
        p={4}
        borderRadius="8px"
        flex={0.5}
      >
        <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
          Execute Shortcuts
        </Text>
        {/* Execute Contract Commands */}
      </Flex>
    </Flex>
  );
};
