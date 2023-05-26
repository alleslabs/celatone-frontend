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
}: PoolLogoProps) => {
  const isShortened = tokens.length > 3;
  return (
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
      {tokens.slice(0, isShortened ? 2 : undefined).map((token, idx) => (
        <PoolAssetLogo
          key={token.denom}
          token={token}
          logoSize={logoSize}
          idx={idx}
        />
      ))}
      {isShortened && (
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
      )}
    </Flex>
  );
};
