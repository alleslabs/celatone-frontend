import type { ImageProps as ChakraImageProps } from "@chakra-ui/react";
import { Image as ChakraImage, Flex } from "@chakra-ui/react";
import type { ImageProps } from "next/image";
import Image from "next/image";
import { useState } from "react";

import { NAToken } from "lib/icon";
import type { Option } from "lib/types";

const TokenImage = ({ boxSize = 5, ...props }: ChakraImageProps) => (
  <ChakraImage
    boxSize={boxSize}
    fallback={<NAToken boxSize={boxSize} />}
    fallbackStrategy="beforeLoadOrError"
    {...props}
  />
);

interface TokenImageRenderProps extends ChakraImageProps {
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

export const TokenImageRenderWithCache = (props: ImageProps) => {
  const { width } = props;
  const [isError, setIsError] = useState(false);

  return !isError ? (
    <Image {...props} onError={() => setIsError(true)} />
  ) : (
    <NAToken boxSize={Number(width) / 4} />
  );
};
