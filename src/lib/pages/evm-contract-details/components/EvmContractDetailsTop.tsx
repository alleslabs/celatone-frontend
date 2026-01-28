import type { EvmVerifyInfo, HexAddr20, Option } from "lib/types";

import { Button, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { EvmContractMaxSupplyValue } from "lib/components/EvmContractMaxSupplyValue";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TokenImageRender } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";

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
  const isMobile = useMobile();
  const evmDenom = contractAddress.replace("0x", "evm/");
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const assetInfo = assetInfos?.[evmDenom];

  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      gap={4}
      justifyContent="space-between"
    >
      <Stack gap={1}>
        <Flex align="center" gap={2} marginBottom={3}>
          {assetInfo ? (
            <>
              <TokenImageRender
                alt={assetInfo.symbol}
                boxSize={isMobile ? 6 : 8}
                logo={assetInfo.logo}
                minW={isMobile ? 6 : 8}
              />
              <Heading
                as={isMobile ? "h6" : "h5"}
                variant={isMobile ? "h6" : "h5"}
                wordBreak="break-word"
              >
                Token: {assetInfo.symbol} ({assetInfo.name})
              </Heading>
            </>
          ) : (
            <>
              <CustomIcon
                boxSize={5}
                color="primary.main"
                name="contract-address"
              />
              <Heading as="h5" variant="h5" wordBreak="break-word">
                Contract details
              </Heading>
            </>
          )}
        </Flex>
        <Flex columnGap={2} flexDirection={{ base: "column", md: "row" }}>
          <Text color="text.dark" fontWeight={500} variant="body2">
            Contract address:
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
            flexDirection={{ base: "column", md: "row" }}
            minHeight={6}
          >
            <Text color="text.dark" fontWeight={500} variant="body2">
              Contract name:
            </Text>
            <Text className="ellipsis" variant="body2">
              {evmVerifyInfo.contractName}
            </Text>
          </Flex>
        )}
        {proxyTargetAddress && (
          <Flex columnGap={2} flexDirection={{ base: "column", md: "row" }}>
            <Text color="text.dark" fontWeight={500} variant="body2">
              Implementation address:
            </Text>
            <Flex alignItems="center">
              <ExplorerLink
                textFormat="normal"
                textLabel={evmVerifyInfo?.contractName}
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
          <Grid gap={2} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}>
            <Button
              leftIcon={<CustomIcon name="query" />}
              variant="outline-primary"
              onClick={() =>
                navigate({
                  pathname: "/evm-contracts/[contractAddress]/[tab]",
                  query: {
                    contractAddress,
                    selectedType: getInteractTabsIndex(true, false),
                    tab: TabIndex.ReadWrite,
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
                    selectedType: getInteractTabsIndex(false, false),
                    tab: TabIndex.ReadWrite,
                  },
                })
              }
            >
              Write
            </Button>
          </Grid>
        )}
        <EvmContractMaxSupplyValue
          contractAddress={contractAddress}
          isCompact
        />
      </Stack>
    </Flex>
  );
};
