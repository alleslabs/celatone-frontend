import { Flex, Text } from "@chakra-ui/react";

import { useExecuteCmds } from "lib/hooks";
import { useContractQueryMsgsRest } from "lib/services/wasm/contract";
import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

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
      direction="column"
      gap={4}
      pb={{ base: 0, md: 8 }}
      borderBottom={{ base: "0px", md: "1px solid" }}
      borderBottomColor={{ base: "transparent", md: "gray.700" }}
    >
      <CommandSectionHeader {...props} />
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", md: "row" }}>
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
          <ContractCmdGroup
            isFetching={isQueryCmdsFetching}
            cmds={queryCmds}
            contractAddress={contractAddress}
            type="query"
          />
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
          <ContractCmdGroup
            isFetching={isExecuteCmdsFetching}
            cmds={execCmds}
            contractAddress={contractAddress}
            type="execute"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
