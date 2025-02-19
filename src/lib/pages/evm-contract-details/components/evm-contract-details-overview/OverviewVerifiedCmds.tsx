import { Flex, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { EvmVerifyInfo } from "lib/types";
import { HexAddr20, Option } from "lib/types";
import { EvmContractCmdGroup } from "./EvmContractCmdGroup";
import { InteractTabsIndex } from "../../types";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { categorizeAbi } from "../interact-evm-contract/utils";
import { CustomIcon } from "lib/components/icon";

interface OverviewVerifiedCmdsProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: EvmVerifyInfo;
  proxyTargetEvmVerifyInfo: Option<EvmVerifyInfo>;
}

export const OverviewVerifiedCmds = ({
  contractAddress,
  evmVerifyInfo,
  proxyTargetEvmVerifyInfo,
}: OverviewVerifiedCmdsProps) => {
  const isMobile = useMobile();

  const { read: abiRead, write: abiWrite } = categorizeAbi(evmVerifyInfo.abi);
  const { read: proxyTargetAbiRead, write: proxyTargetAbiWrite } =
    categorizeAbi(proxyTargetEvmVerifyInfo?.abi ?? []);

  return (
    <>
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
      {proxyTargetEvmVerifyInfo && (
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
            </HStack>
          </Stack>
          <Flex gap={4} width="full">
            <EvmContractCmdGroup
              contractAddress={contractAddress}
              abiSections={proxyTargetAbiRead}
              interactTab={InteractTabsIndex.ReadProxy}
            />
            {!isMobile && (
              <EvmContractCmdGroup
                contractAddress={contractAddress}
                abiSections={proxyTargetAbiWrite}
                interactTab={InteractTabsIndex.WriteProxy}
              />
            )}
          </Flex>
        </VStack>
      )}
    </>
  );
};
