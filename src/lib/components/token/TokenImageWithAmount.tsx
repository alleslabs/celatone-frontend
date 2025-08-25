import type { ImageProps, TextProps } from "@chakra-ui/react";
import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { formatTokenWithValue } from "lib/utils";

import { Copier } from "../copy";
import { TokenImageRender } from "./TokenImageRender";

interface TokenImageWithAmountProps {
  boxSize?: ImageProps["boxSize"];
  fontWeight?: TextProps["fontWeight"];
  hasTrailingZeros?: boolean;
  showCopyOnHover?: boolean;
  token: TokenWithValue;
  variant?: TextProps["variant"];
}

export const TokenImageWithAmount = ({
  boxSize = 4,
  fontWeight = 400,
  showCopyOnHover = true,
  token,
  variant = "body2",
}: TokenImageWithAmountProps) => {
  const isMobile = useMobile();

  return (
    <Flex className="copier-wrapper" alignItems="center" minWidth="fit-content">
      <TokenImageRender boxSize={boxSize} logo={token.logo} />
      <Text
        fontWeight={fontWeight}
        ml={1}
        variant={variant}
        wordBreak="break-all"
      >
        {formatTokenWithValue({ token })}
      </Text>
      <Copier
        display={showCopyOnHover && !isMobile ? "none" : "inline"}
        hoverLabel={`Copy token id: ${token.denom}`}
        ml={1}
        type="token"
        value={token.denom}
      />
    </Flex>
  );
};
