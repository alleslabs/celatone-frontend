import type { EvmVerifyInfo, HexAddr20, Option } from "lib/types";

import { Button, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { useConvertHexAddress, useInternalNavigate } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TotalValue } from "lib/components/TotalValue";

import { TabIndex } from "../types";
import { getInteractTabsIndex } from "../utils";

interface EvmContractDetailsTopProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: Option<EvmVerifyInfo>;
  proxyTargetAddress: Option<HexAddr20>;
  proxyTargetEvmVerifyInfo: Option<EvmVerifyInfo>;
}

export const EvmContractDetailsTop = ({
  contractAddress,
  evmVerifyInfo,
  proxyTargetAddress,
  proxyTargetEvmVerifyInfo,
}: EvmContractDetailsTopProps) => {
  const navigate = useInternalNavigate();
  const { convertHexWalletAddress } = useConvertHexAddress();

  return (
    <Flex
      flexDirection={{ md: "row", base: "column" }}
      gap={4}
      justifyContent="space-between"
    >
      <Stack gap={1}>
        <Flex align="center" gap={2} marginBottom={3}>
          <CustomIcon
            boxSize={5}
            color="primary.main"
            name="contract-address"
          />
          <Heading as="h5" variant="h5" wordBreak="break-word">
            Contract Details
          </Heading>
        </Flex>
        <Flex columnGap={2} flexDirection={{ base: "column", md: "row" }}>
          <Text color="text.dark" fontWeight={500} variant="body2">
            Contract Address:
          </Text>
          <Flex alignItems="center">
            <CopyLink
              amptrackSection="contract_top"
              type="contract_address"
              value={contractAddress}
            />
            {!!evmVerifyInfo?.isVerified && (
              <CustomIcon
                boxSize={4}
                color="secondary.main"
                name="verification-solid"
              />
            )}
          </Flex>
        </Flex>
        {!!evmVerifyInfo?.isVerified && evmVerifyInfo.contractName && (
          <Flex
            columnGap={2}
            flexDirection={{ md: "row", base: "column" }}
            minHeight={6}
          >
            <Text color="text.dark" fontWeight={500} variant="body2">
              Contract Name:
            </Text>
            <Text className="ellipsis" variant="body2">
              {evmVerifyInfo.contractName}
            </Text>
          </Flex>
        )}
        {proxyTargetAddress && (
          <Flex columnGap={2} flexDirection={{ md: "row", base: "column" }}>
            <Text color="text.dark" fontWeight={500} variant="body2">
              Implementation Address:
            </Text>
            <Flex alignItems="center">
              <ExplorerLink
                textFormat="normal"
                type="evm_contract_address"
                value={proxyTargetAddress}
              />
              {!!proxyTargetEvmVerifyInfo?.isVerified && (
                <CustomIcon
                  boxSize={4}
                  color="secondary.main"
                  name="verification-solid"
                />
              )}
            </Flex>
          </Flex>
        )}
      </Stack>
      <Stack gap={4}>
        {!!evmVerifyInfo?.isVerified && (
          <Grid gap={2} templateColumns={{ md: "repeat(2, 1fr)", base: "1fr" }}>
            <Button
              leftIcon={<CustomIcon name="query" />}
              variant="outline-primary"
              onClick={() =>
                navigate({
                  pathname: "/evm-contracts/[contractAddress]/[tab]",
                  query: {
                    contractAddress,
                    tab: TabIndex.ReadWrite,
                    selectedType: getInteractTabsIndex(true, false),
                  },
                })
              }
            >
              Read
            </Button>
            <Button
              display={{ base: "none", md: "flex" }}
              leftIcon={<CustomIcon name="execute" />}
              variant="outline-primary"
              onClick={() =>
                navigate({
                  pathname: "/evm-contracts/[contractAddress]/[tab]",
                  query: {
                    contractAddress,
                    tab: TabIndex.ReadWrite,
                    selectedType: getInteractTabsIndex(false, false),
                  },
                })
              }
            >
              Write
            </Button>
          </Grid>
        )}
        <TotalValue
          address={convertHexWalletAddress(contractAddress)}
          label="Total value"
          isCompact
          label="Total Value"
        />
      </Stack>
    </Flex>
  );
};
