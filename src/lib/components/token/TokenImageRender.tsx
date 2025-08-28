import type { ImageProps as ChakraImageProps } from "@chakra-ui/react";
import type { Option } from "lib/types";
import type { ImageProps } from "next/image";

import { Image as ChakraImage, Flex } from "@chakra-ui/react";
import { NAToken } from "lib/icon";
import Image from "next/image";
import { useState } from "react";

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

export const TokenImageRender = ({
  boxSize,
  logo,
  ...props
}: TokenImageRenderProps) =>
  Array.isArray(logo) ? (
    <Flex minW="fit-content">
      <TokenImage
        alt={logo[0]}
        boxSize={boxSize}
        minW={boxSize}
        src={logo[0]}
        zIndex={1}
        {...props}
      />
      <TokenImage
        alt={logo[1]}
        boxSize={boxSize}
        minW={boxSize}
        ml="-6px"
        src={logo[1]}
        {...props}
      />
    </Flex>
  ) : (
    <TokenImage
      alt={logo}
      boxSize={boxSize}
      minW={boxSize}
      src={logo}
      {...props}
    />
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
