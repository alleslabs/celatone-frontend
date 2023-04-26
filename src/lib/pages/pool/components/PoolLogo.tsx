import { Flex, Image, Text } from "@chakra-ui/react";

import { getUndefinedTokenIcon } from "../utils";
import type { AssetInfo, Option } from "lib/types";

interface PoolLogoProps {
  assets: string[];
  assetInfos: Option<Record<string, AssetInfo>>;
  logoSize?: number;
  marginLeft?: number;
  textVariant?: string;
}

export const PoolLogo = ({
  assets,
  assetInfos,
  logoSize = 10,
  marginLeft = -12,
  textVariant = "body2",
}: PoolLogoProps) => {
  const renderLogo = (denom: string, i: number) => (
    <Image
      key={denom}
      boxSize={logoSize}
      src={assetInfos?.[denom]?.logo || getUndefinedTokenIcon(denom)}
      zIndex={i * -1 + 2}
    />
  );

  return (
    <Flex
      css={{
        ">:not(:first-child)": {
          marginLeft,
        },
      }}
      width="96px"
      alignItems="center"
      justifyContent="center"
    >
      {assets.length > 3 ? (
        <>
          {assets.slice(0, 2).map(renderLogo)}
          <Flex
            width={logoSize}
            height={logoSize}
            borderRadius="full"
            backgroundColor="pebble.700"
            alignItems="center"
            justifyContent="center"
          >
            <Text variant={textVariant}> +{assets.length - 2}</Text>
          </Flex>
        </>
      ) : (
        assets.map(renderLogo)
      )}
    </Flex>
  );
};
