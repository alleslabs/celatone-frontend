import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { TokenImageRender } from "lib/components/token";
import type { TokenWithValue } from "lib/types";
import { getUndefinedTokenIcon } from "../utils";

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
        <Flex key={token.denom}>
          <TokenImageRender
            logo={token.logo || getUndefinedTokenIcon(token.denom)}
            boxSize={logoSize}
            zIndex={2 - idx}
          />
        </Flex>
      ))}
      {isShortened && (
        <Flex
          width={logoSize}
          height={logoSize}
          borderRadius="full"
          backgroundColor="gray.700"
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
