import type { FlexProps } from "@chakra-ui/react";
import type { AssetInfo, Option, Token, U, USD } from "lib/types";

import { Badge, Flex, Image, Text } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { Tooltip } from "lib/components/Tooltip";
import { NAToken } from "lib/icon";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
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
  const evm = useEvmConfig({ shouldRedirect: false });
  const symbol = getTokenLabel(denom, assetInfo?.symbol, false);
  return (
    <Tooltip label={`Token ID: ${denom}`} maxW="240px" textAlign="center">
      <Flex
        className="copier-wrapper"
        background="gray.800"
        borderRadius="8px"
        direction="column"
        gap={2}
        minH="100px"
        p={3}
        w="full"
        {...cardProps}
      >
        <Flex
          alignItems="center"
          borderBottomColor="gray.700"
          borderBottomWidth="1px"
          gap={1}
          pb={2}
        >
          <Image
            alt={symbol}
            boxSize={6}
            fallback={<NAToken />}
            fallbackStrategy="beforeLoadOrError"
            src={assetInfo?.logo ?? getUndefinedTokenIcon(denom)}
          />
          <Text className="ellipsis" fontWeight="bold" variant="body2">
            {symbol}
          </Text>
          {assetInfo && (
            <Badge ml="6px" variant="gray">
              {formatPrice(assetInfo.price as USD<number>)}
            </Badge>
          )}
          <Copier
            amptrackSection={ampCopierSection}
            copyLabel="Token ID copied!"
            display="none"
            ml="1px"
            type={assetInfo?.price ? "supported_asset" : "unsupported_asset"}
            value={denom}
          />
        </Flex>

        <Flex direction="column">
          <Text fontWeight="700" variant="body2">
            {formatUTokenWithPrecision({
              amount: amount as U<Token>,
              isEvm: evm.enabled,
              isSuffix: false,
              precision: assetInfo?.precision ?? 0,
            })}
          </Text>
          {assetInfo && (
            <Text color="text.dark" variant="body3">
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
