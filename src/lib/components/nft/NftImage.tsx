import type { ImageProps } from "@chakra-ui/react";

import { Image } from "@chakra-ui/react";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data/image";

interface NftImageProps extends ImageProps {}

export const NftImage = ({ ...props }: NftImageProps) => (
  <Image
    fallbackSrc={NFT_IMAGE_PLACEHOLDER}
    fallbackStrategy="beforeLoadOrError"
    {...props}
  />
);
