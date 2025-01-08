import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { getUndefinedTokenIcon } from "../utils";
import { TokenImageRender } from "lib/components/token";
import type { TokenWithValue } from "lib/types";

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
      minW={minW}
      justifyContent="center"
    >
      {tokens.slice(0, isShortened ? 2 : undefined).map((token, idx) => (
        <Flex key={token.denom}>
          <TokenImageRender
            zIndex={2 - idx}
            boxSize={logoSize}
            logo={token.logo || getUndefinedTokenIcon(token.denom)}
          />
        </Flex>
      ))}
      {isShortened && (
        <Flex
          width={logoSize}
          alignItems="center"
          height={logoSize}
          marginLeft="-12px"
          backgroundColor="gray.700"
          borderRadius="full"
          justifyContent="center"
        >
          <Text variant={textVariant}> +{tokens.length - 2}</Text>
        </Flex>
      )}
    </Flex>
  );
};
