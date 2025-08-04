import type { EvmVerifyInfo, HexAddr20 } from "lib/types";

import { Flex, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

import { InteractTabsIndex } from "../../types";
import { categorizeAbi } from "../interact-evm-contract/utils";
import { EvmContractCmdGroup } from "./EvmContractCmdGroup";

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
    <VStack alignItems="flex-start" spacing={4}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Proxy target contract
        </Heading>
        <HStack alignItems="center" spacing={2}>
          <Text color="text.dark" variant="body2">
            Implementation Address:
          </Text>
          <ExplorerLink
            showCopyOnHover
            textFormat={isMobile ? "truncate" : "normal"}
            textLabel={proxyTargetEvmVerifyInfo.contractName}
            type="evm_contract_address"
            value={proxyTargetEvmVerifyInfo.address}
          />
          {proxyTargetEvmVerifyInfo?.isVerified && (
            <CustomIcon
              boxSize={4}
              color="secondary.main"
              name="verification-solid"
            />
          )}
        </HStack>
      </Stack>
      <Flex gap={4} width="full">
        <EvmContractCmdGroup
          abiSections={proxyTargetAbiRead}
          contractAddress={contractAddress}
          interactTab={InteractTabsIndex.ReadProxy}
        />
        <EvmContractCmdGroup
          abiSections={proxyTargetAbiWrite}
          contractAddress={contractAddress}
          interactTab={InteractTabsIndex.WriteProxy}
        />
      </Flex>
    </VStack>
  );
};
