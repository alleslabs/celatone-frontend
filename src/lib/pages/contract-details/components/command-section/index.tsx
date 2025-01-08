import { Flex, Text } from "@chakra-ui/react";

import { useExecuteCmds } from "lib/hooks";
import { useContractQueryMsgsLcd } from "lib/services/wasm/contract";
import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

import { CommandSectionHeader } from "./CommandSectionHeader";
import { ContractCmdGroup } from "./ContractCmdGroup";

interface CommandSectionProps {
  codeHash: string;
  codeId: number;
  contractAddress: BechAddr32;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CommandSection = ({
  contractAddress,
  ...props
}: CommandSectionProps) => {
  const { data: queryCmds = [], isFetching: isQueryCmdsFetching } =
    useContractQueryMsgsLcd(contractAddress);
  const { execCmds, isFetching: isExecuteCmdsFetching } =
    useExecuteCmds(contractAddress);

  return (
    <Flex
      gap={4}
      pb={{ base: 0, md: 8 }}
      borderBottom={{ base: "0px", md: "1px solid" }}
      borderBottomColor={{ base: "transparent", md: "gray.700" }}
      direction="column"
    >
      <CommandSectionHeader {...props} />
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", md: "row" }}>
        <Flex
          bg="gray.900"
          flex={0.5}
          p={4}
          borderRadius="8px"
          direction="column"
        >
          <Text mb={2} variant="body2" color="text.dark" fontWeight={500}>
            Query Shortcuts
          </Text>
          <ContractCmdGroup
            cmds={queryCmds}
            isFetching={isQueryCmdsFetching}
            type="query"
            contractAddress={contractAddress}
          />
        </Flex>
        <Flex
          bg="gray.900"
          flex={0.5}
          p={4}
          borderRadius="8px"
          direction="column"
        >
          <Text mb={2} variant="body2" color="text.dark" fontWeight={500}>
            Execute Shortcuts
          </Text>
          <ContractCmdGroup
            cmds={execCmds}
            isFetching={isExecuteCmdsFetching}
            type="execute"
            contractAddress={contractAddress}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
