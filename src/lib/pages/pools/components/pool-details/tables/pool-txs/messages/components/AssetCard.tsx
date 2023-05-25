import type { FlexProps } from "@chakra-ui/react";
import { Badge, Text, Image, Flex } from "@chakra-ui/react";

import { Copier } from "lib/components/copy";
import { Tooltip } from "lib/components/Tooltip";
import { NAToken } from "lib/icon";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { AssetInfo, Option, Token, U, USD } from "lib/types";
import {
  calculateAssetValue,
  formatPrice,
  formatUTokenWithPrecision,
  toToken,
} from "lib/utils";

interface AssetCardProps extends FlexProps {
  amount: string;
  denom: string;
  assetInfo: Option<AssetInfo>;
  ampCopierSection?: string;
}

export const AssetCard = ({
  amount,
  denom,
  assetInfo,
  ampCopierSection,
  ...cardProps
}: AssetCardProps) => {
  const symbol = assetInfo?.symbol ?? denom;
  return (
    <Tooltip label={`Token ID: ${denom}`} maxW="240px" textAlign="center">
      <Flex
        className="copier-wrapper"
        direction="column"
        minH="100px"
        gap={2}
        p={3}
        minW="250px"
        background="pebble.800"
        borderRadius="8px"
        {...cardProps}
      >
        <Flex
          gap={1}
          alignItems="center"
          borderBottom="1px solid"
          borderBottomColor="pebble.700"
          pb={2}
        >
          <Image
            boxSize={6}
            src={assetInfo?.logo ?? getUndefinedTokenIcon(denom)}
            alt={symbol}
            fallback={<NAToken />}
            fallbackStrategy="onError"
          />
          <Text variant="body2" className="ellipsis" fontWeight="bold">
            {symbol}
          </Text>
          {assetInfo && (
            <Badge variant="gray" ml="6px">
              {formatPrice(assetInfo.price as USD<number>)}
            </Badge>
          )}
          <Copier
            type={assetInfo?.price ? "supported_asset" : "unsupported_asset"}
            value={denom}
            copyLabel="Token ID Copied!"
            display="none"
            ml="1px"
            amptrackSection={ampCopierSection}
          />
        </Flex>

        <Flex direction="column">
          <Text fontWeight="700" variant="body2">
            {formatUTokenWithPrecision(
              amount as U<Token>,
              assetInfo?.precision ?? 0,
              false
            )}
          </Text>
          {assetInfo && (
            <Text variant="body3" color="text.dark">
              {formatPrice(
                calculateAssetValue(
                  toToken(amount as U<Token>, assetInfo.precision),
                  assetInfo.price as USD<number>
                )
              )}
            </Text>
          )}
        </Flex>
      </Flex>
    </Tooltip>
  );
};
