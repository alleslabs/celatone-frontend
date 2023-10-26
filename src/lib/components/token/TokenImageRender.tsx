import type { ImageProps } from "@chakra-ui/react";
import { Image, Flex } from "@chakra-ui/react";

import { NAToken } from "lib/icon";
import type { Option } from "lib/types";

const TokenImage = (props: ImageProps) => (
  <Image
    boxSize={5}
    fallback={<NAToken />}
    fallbackStrategy="onError"
    {...props}
  />
);

interface TokenImageRenderProps extends ImageProps {
  logo: Option<string | string[]>;
}

export const TokenImageRender = ({ logo, ...props }: TokenImageRenderProps) =>
  Array.isArray(logo) ? (
    <Flex>
      <TokenImage src={logo[0]} alt={logo[0]} zIndex={1} {...props} />
      <TokenImage src={logo[1]} alt={logo[1]} ml="-6px" {...props} />
    </Flex>
  ) : (
    <TokenImage src={logo} alt={logo} {...props} />
  );
