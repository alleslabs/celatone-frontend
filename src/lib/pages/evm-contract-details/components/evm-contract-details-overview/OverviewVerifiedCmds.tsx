import { Flex, Heading, VStack } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import type { EvmVerifyInfo, HexAddr20 } from "lib/types";
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
    <VStack spacing={4} alignItems="flex-start">
      <Flex gap={1} alignItems="center">
        <Heading as="h6" variant="h6">
          Verified command shortcuts
        </Heading>
        <CustomIcon
          name="verification-solid"
          boxSize={4}
          color="secondary.main"
        />
      </Flex>
      <Flex
        gap={4}
        width="full"
        flexDirection={{
          base: "column",
          md: "row",
        }}
      >
        <EvmContractCmdGroup
          contractAddress={contractAddress}
          abiSections={abiRead}
          interactTab={InteractTabsIndex.Read}
        />
        <EvmContractCmdGroup
          contractAddress={contractAddress}
          abiSections={abiWrite}
          interactTab={InteractTabsIndex.Write}
        />
      </Flex>
    </VStack>
  );
};
