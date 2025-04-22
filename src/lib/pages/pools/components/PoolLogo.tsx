import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";
import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { TokenImageRender } from "lib/components/token";

import { getUndefinedTokenIcon } from "../utils";

interface PoolLogoProps {
  logoSize?: ImageProps["boxSize"];
  marginLeft?: number;
  minW?: FlexProps["minW"];
  textVariant?: TextProps["variant"];
  tokens: TokenWithValue[];
}

export const PoolLogo = ({
  logoSize = 10,
  marginLeft = -12,
  minW = 24,
  textVariant = "body2",
  tokens,
}: PoolLogoProps) => {
  const isShortened = tokens.length > 3;
  return (
    <Flex
      alignItems="center"
      css={{
        ">:not(:first-of-type)": {
          marginLeft,
        },
      }}
      justifyContent="center"
      minW={minW}
    >
      {tokens.slice(0, isShortened ? 2 : undefined).map((token, idx) => (
        <Flex key={token.denom}>
          <TokenImageRender
            boxSize={logoSize}
            logo={token.logo || getUndefinedTokenIcon(token.denom)}
            zIndex={2 - idx}
          />
        </Flex>
      ))}
      {isShortened && (
        <Flex
          alignItems="center"
          backgroundColor="gray.700"
          borderRadius="full"
          height={logoSize}
          justifyContent="center"
          marginLeft="-12px"
          width={logoSize}
        >
          <Text variant={textVariant}> +{tokens.length - 2}</Text>
        </Flex>
      )}
    </Flex>
  );
};
