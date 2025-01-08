import type { FlexProps } from "@chakra-ui/react";
import { Badge, Flex, Image, Text } from "@chakra-ui/react";

import { Copier } from "lib/components/copy";
import { Tooltip } from "lib/components/Tooltip";
import { NAToken } from "lib/icon";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { AssetInfo, Option, Token, U, USD } from "lib/types";
import {
  calculateAssetValue,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
  toToken,
} from "lib/utils";

interface AssetCardProps extends FlexProps {
  amount: string;
  ampCopierSection?: string;
  assetInfo: Option<AssetInfo>;
  denom: string;
}

export const AssetCard = ({
  amount,
  ampCopierSection,
  assetInfo,
  denom,
  ...cardProps
}: AssetCardProps) => {
  const symbol = getTokenLabel(denom, assetInfo?.symbol, false);
  return (
    <Tooltip label={`Token ID: ${denom}`} maxW="240px" textAlign="center">
      <Flex
        className="copier-wrapper"
        gap={2}
        minH="100px"
        p={3}
        w="full"
        background="gray.800"
        borderRadius="8px"
        direction="column"
        {...cardProps}
      >
        <Flex
          alignItems="center"
          gap={1}
          pb={2}
          borderBottom="1px solid"
          borderBottomColor="gray.700"
        >
          <Image
            alt={symbol}
            fallback={<NAToken />}
            fallbackStrategy="beforeLoadOrError"
            src={assetInfo?.logo ?? getUndefinedTokenIcon(denom)}
            boxSize={6}
          />
          <Text className="ellipsis" variant="body2" fontWeight="bold">
            {symbol}
          </Text>
          {assetInfo && (
            <Badge ml="6px" variant="gray">
              {formatPrice(assetInfo.price as USD<number>)}
            </Badge>
          )}
          <Copier
            display="none"
            ml="1px"
            type={assetInfo?.price ? "supported_asset" : "unsupported_asset"}
            value={denom}
            amptrackSection={ampCopierSection}
            copyLabel="Token ID Copied!"
          />
        </Flex>

        <Flex direction="column">
          <Text variant="body2" fontWeight="700">
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
