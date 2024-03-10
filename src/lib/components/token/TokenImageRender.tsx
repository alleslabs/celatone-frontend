import type { ImageProps } from "@chakra-ui/react";
import { Flex, Image } from "@chakra-ui/react";

import { NAToken } from "lib/icon";
import type { Option } from "lib/types";

const TokenImage = ({ boxSize = 5, ...props }: ImageProps) => (
  <Image
    boxSize={boxSize}
    fallback={<NAToken boxSize={boxSize} />}
    fallbackStrategy="beforeLoadOrError"
    {...props}
  />
);

interface TokenImageRenderProps extends ImageProps {
  logo: Option<string> | Option<string>[];
}

export const TokenImageRender = ({ logo, ...props }: TokenImageRenderProps) =>
  Array.isArray(logo) ? (
    <Flex minW="fit-content">
      <TokenImage src={logo[0]} alt={logo[0]} zIndex={1} {...props} />
      <TokenImage src={logo[1]} alt={logo[1]} ml="-6px" {...props} />
    </Flex>
  ) : (
    <TokenImage src={logo} alt={logo} {...props} />
  );
