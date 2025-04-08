import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useExecuteCmds } from "lib/hooks";
import { useContractQueryMsgsRest } from "lib/services/wasm/contract";

import { CommandSectionHeader } from "./CommandSectionHeader";
import { ContractCmdGroup } from "./ContractCmdGroup";

interface CommandSectionProps {
  contractAddress: BechAddr32;
  codeHash: string;
  codeId: number;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CommandSection = ({
  contractAddress,
  ...props
}: CommandSectionProps) => {
  const { isFetching: isQueryCmdsFetching, data: queryCmds = [] } =
    useContractQueryMsgsRest(contractAddress);
  const { isFetching: isExecuteCmdsFetching, execCmds } =
    useExecuteCmds(contractAddress);

  return (
    <Flex
      borderBottom={{ base: "0px", md: "1px solid" }}
      borderBottomColor={{ base: "transparent", md: "gray.700" }}
      direction="column"
      gap={4}
      pb={{ base: 0, md: 8 }}
    >
      <CommandSectionHeader {...props} />
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 6 }}>
        <Flex
          bg="gray.900"
          borderRadius="8px"
          direction="column"
          flex={0.5}
          p={4}
        >
          <Text color="text.dark" fontWeight={500} mb={2} variant="body2">
            Query shortcuts
          </Text>
          <ContractCmdGroup
            cmds={queryCmds}
            contractAddress={contractAddress}
            isFetching={isQueryCmdsFetching}
            type="query"
          />
        </Flex>
        <Flex
          bg="gray.900"
          borderRadius="8px"
          direction="column"
          flex={0.5}
          p={4}
        >
          <Text color="text.dark" fontWeight={500} mb={2} variant="body2">
            Execute shortcuts
          </Text>
          <ContractCmdGroup
            cmds={execCmds}
            contractAddress={contractAddress}
            isFetching={isExecuteCmdsFetching}
            type="execute"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
