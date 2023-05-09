import type { FlexProps, TextProps } from "@chakra-ui/react";
import { Flex, Image, Text } from "@chakra-ui/react";

import { getUndefinedTokenIcon } from "../utils";
import type { TokenWithValue } from "lib/types";

interface PoolLogoProps {
  tokens: TokenWithValue[];
  logoSize?: FlexProps["height"] | FlexProps["width"];
  marginLeft?: number;
  textVariant?: TextProps["variant"];
}

export const PoolLogo = ({
  tokens,
  logoSize = 10,
  marginLeft = -12,
  textVariant = "body2",
}: PoolLogoProps) => {
  const renderLogo = (token: TokenWithValue, i: number) => (
    <Image
      key={token.denom}
      boxSize={logoSize}
      src={token.logo || getUndefinedTokenIcon(token.denom)}
      zIndex={2 - i}
    />
  );

  return (
    <Flex
      css={{
        ">:not(:first-of-type)": {
          marginLeft,
        },
      }}
      width="96px"
      alignItems="center"
      justifyContent="center"
    >
      {tokens.length > 3 ? (
        <>
          {tokens.slice(0, 2).map(renderLogo)}
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
        tokens.map(renderLogo)
      )}
    </Flex>
  );
};
