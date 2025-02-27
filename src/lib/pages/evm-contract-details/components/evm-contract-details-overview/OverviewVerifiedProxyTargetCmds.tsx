import { Flex, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { EvmVerifyInfo, HexAddr20 } from "lib/types";
import { EvmContractCmdGroup } from "./EvmContractCmdGroup";
import { InteractTabsIndex } from "../../types";
import { categorizeAbi } from "../interact-evm-contract/utils";

interface OverviewVerifiedProxyTargetCmdsProps {
  contractAddress: HexAddr20;
  proxyTargetEvmVerifyInfo: EvmVerifyInfo;
}

export const OverviewVerifiedProxyTargetCmds = ({
  contractAddress,
  proxyTargetEvmVerifyInfo,
}: OverviewVerifiedProxyTargetCmdsProps) => {
  const isMobile = useMobile();

  const { read: proxyTargetAbiRead, write: proxyTargetAbiWrite } =
    categorizeAbi(proxyTargetEvmVerifyInfo?.abi ?? []);

  return (
    <VStack spacing={4} alignItems="flex-start">
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Proxy target contract
        </Heading>
        <HStack spacing={2} alignItems="center">
          <Text variant="body2" color="text.dark">
            Implementation Address:
          </Text>
          <ExplorerLink
            type="evm_contract_address"
            value={proxyTargetEvmVerifyInfo.address}
            textFormat={isMobile ? "truncate" : "normal"}
            showCopyOnHover
          />
          {proxyTargetEvmVerifyInfo?.isVerified && (
            <CustomIcon
              name="verification-solid"
              boxSize={4}
              color="secondary.main"
            />
          )}
        </HStack>
      </Stack>
      <Flex gap={4} width="full">
        <EvmContractCmdGroup
          contractAddress={contractAddress}
          abiSections={proxyTargetAbiRead}
          interactTab={InteractTabsIndex.ReadProxy}
        />
        <EvmContractCmdGroup
          contractAddress={contractAddress}
          abiSections={proxyTargetAbiWrite}
          interactTab={InteractTabsIndex.WriteProxy}
        />
      </Flex>
    </VStack>
  );
};
