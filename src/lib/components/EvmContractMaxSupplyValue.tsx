import type { HexAddr20 } from "lib/types";

import { Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import { useConvertHexAddress } from "lib/app-provider";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmTotalSupply } from "lib/services/evm";
import { coinToTokenWithValue, formatUTokenWithPrecision } from "lib/utils";

import { TotalValue } from "./TotalValue";

interface EvmContractMaxSupplyValueProps {
  contractAddress: HexAddr20;
  isCompact?: boolean;
}

export const EvmContractMaxSupplyValue = ({
  contractAddress,
  isCompact = false,
}: EvmContractMaxSupplyValueProps) => {
  const { convertHexWalletAddress } = useConvertHexAddress();
  const {
    data: totalSupply,
    error: totalSupplyError,
    isLoading: totalSupplyIsLoading,
  } = useEvmTotalSupply(contractAddress);

  const evmDenom = contractAddress.replace("0x", "evm/");
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const assetInfo = assetInfos?.[evmDenom];

  // Convert totalSupply to token using the same pattern as holders table
  const token = totalSupply
    ? coinToTokenWithValue(evmDenom, totalSupply.toString(), assetInfos)
    : null;

  // If it's an asset with total supply, show total supply
  if (assetInfo && token && !totalSupplyError) {
    return (
      <Flex
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
        direction="column"
        minW="200px"
        p={isCompact ? 3 : 4}
      >
        <Text color="text.dark" fontWeight={500} variant="body2">
          Max total supply ({assetInfo.symbol})
        </Text>
        {totalSupplyIsLoading ? (
          <Skeleton
            borderRadius={2}
            endColor="gray.700"
            h={5}
            mt={1}
            startColor="gray.500"
          />
        ) : (
          <Heading
            as="h5"
            color={
              !totalSupply || totalSupply.toString() === "0"
                ? "text.disabled"
                : "text.main"
            }
            variant="h5"
          >
            {formatUTokenWithPrecision({
              amount: token.amount,
              precision: token.precision ?? 0,
            })}
          </Heading>
        )}
      </Flex>
    );
  }

  // Otherwise, fall back to showing total value
  return (
    <TotalValue
      address={convertHexWalletAddress(contractAddress)}
      isCompact={isCompact}
      label="Total value"
    />
  );
};
