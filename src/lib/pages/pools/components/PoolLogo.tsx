import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";
import { Flex, Image, Text } from "@chakra-ui/react";

import { getUndefinedTokenIcon } from "../utils";
import type { TokenWithValue } from "lib/types";

interface PoolAssetLogoProps {
  token: TokenWithValue;
  logoSize: ImageProps["boxSize"];
  idx: number;
}

const PoolAssetLogo = ({ token, logoSize, idx }: PoolAssetLogoProps) => (
  <Flex key={token.denom}>
    <Image
      boxSize={logoSize}
      src={token.logo || getUndefinedTokenIcon(token.denom)}
      zIndex={2 - idx}
    />
  </Flex>
);

interface PoolLogoProps {
  tokens: TokenWithValue[];
  logoSize?: ImageProps["boxSize"];
  marginLeft?: number;
  minW?: FlexProps["minW"];
  textVariant?: TextProps["variant"];
}

export const PoolLogo = ({
  tokens,
  logoSize = 10,
  marginLeft = -12,
  minW = 24,
  textVariant = "body2",
}: PoolLogoProps) => (
  <Flex
    css={{
      ">:not(:first-of-type)": {
        marginLeft,
      },
    }}
    minW={minW}
    alignItems="center"
    justifyContent="center"
  >
    {tokens.length > 3 ? (
      <>
        {tokens.slice(0, 2).map((token, idx) => (
          <PoolAssetLogo token={token} logoSize={logoSize} idx={idx} />
        ))}
        <Flex
          width={logoSize}
          height={logoSize}
          borderRadius="full"
          backgroundColor="pebble.700"
          alignItems="center"
          justifyContent="center"
          marginLeft="-12px"
        >
          <Text variant={textVariant}> +{tokens.length - 2}</Text>
        </Flex>
      </>
    ) : (
      tokens.map((token, idx) => (
        <PoolAssetLogo token={token} logoSize={logoSize} idx={idx} />
      ))
    )}
  </Flex>
);
