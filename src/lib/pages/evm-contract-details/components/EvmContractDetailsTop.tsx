import { Button, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";

import { useConvertHexAddress, useInternalNavigate } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TotalValue } from "lib/components/TotalValue";
import type { EvmVerifyInfo, HexAddr20, Option } from "lib/types";
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
      justifyContent="space-between"
      gap={4}
    >
      <Stack gap={1}>
        <Flex gap={2} marginBottom={3} align="center">
          <CustomIcon
            name="contract-address"
            boxSize={5}
            color="primary.main"
          />
          <Heading as="h5" variant="h5" wordBreak="break-word">
            Contract Details
          </Heading>
        </Flex>
        <Flex columnGap={2} flexDirection={{ base: "column", md: "row" }}>
          <Text variant="body2" fontWeight={500} color="text.dark">
            Contract Address:
          </Text>
          <Flex alignItems="center">
            <CopyLink
              value={contractAddress}
              amptrackSection="contract_top"
              type="contract_address"
            />
            {!!evmVerifyInfo?.isVerified && (
              <CustomIcon
                name="verification-solid"
                boxSize={4}
                color="secondary.main"
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
            <Text variant="body2" fontWeight={500} color="text.dark">
              Contract Name:
            </Text>
            <Text variant="body2" className="ellipsis">
              {evmVerifyInfo.contractName}
            </Text>
          </Flex>
        )}
        {proxyTargetAddress && (
          <Flex columnGap={2} flexDirection={{ md: "row", base: "column" }}>
            <Text variant="body2" fontWeight={500} color="text.dark">
              Implementation Address:
            </Text>
            <Flex alignItems="center">
              <ExplorerLink
                type="evm_contract_address"
                value={proxyTargetAddress}
                textFormat="normal"
              />
              {!!proxyTargetEvmVerifyInfo?.isVerified && (
                <CustomIcon
                  name="verification-solid"
                  boxSize={4}
                  color="secondary.main"
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
              variant="outline-primary"
              leftIcon={<CustomIcon name="query" />}
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
              variant="outline-primary"
              leftIcon={<CustomIcon name="execute" />}
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
              display={{ base: "none", md: "flex" }}
            >
              Write
            </Button>
          </Grid>
        )}
        <TotalValue
          address={convertHexWalletAddress(contractAddress)}
          label="Total Value"
          isCompact
        />
      </Stack>
    </Flex>
  );
};
