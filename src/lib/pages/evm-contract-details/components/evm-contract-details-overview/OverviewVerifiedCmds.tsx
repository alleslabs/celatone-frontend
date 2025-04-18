import type { EvmVerifyInfo, HexAddr20 } from "lib/types";

import { Flex, Heading, VStack } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

import { InteractTabsIndex } from "../../types";
import { categorizeAbi } from "../interact-evm-contract/utils";
import { EvmContractCmdGroup } from "./EvmContractCmdGroup";

interface OverviewVerifiedCmdsProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: EvmVerifyInfo;
}

export const OverviewVerifiedCmds = ({
  contractAddress,
  evmVerifyInfo,
}: OverviewVerifiedCmdsProps) => {
  const { read: abiRead, write: abiWrite } = categorizeAbi(evmVerifyInfo.abi);

  return (
    <VStack alignItems="flex-start" spacing={4}>
      <Flex alignItems="center" gap={1}>
        <Heading as="h6" variant="h6">
          Verified command shortcuts
        </Heading>
        <CustomIcon
          boxSize={4}
          color="secondary.main"
          name="verification-solid"
        />
      </Flex>
      <Flex
        flexDirection={{
          base: "column",
          md: "row",
        }}
        gap={4}
        width="full"
      >
        <EvmContractCmdGroup
          abiSections={abiRead}
          contractAddress={contractAddress}
          interactTab={InteractTabsIndex.Read}
        />
        <EvmContractCmdGroup
          abiSections={abiWrite}
          contractAddress={contractAddress}
          interactTab={InteractTabsIndex.Write}
        />
      </Flex>
    </VStack>
  );
};
