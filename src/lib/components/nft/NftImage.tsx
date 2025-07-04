import type { ImageProps } from "@chakra-ui/react";

import { Image } from "@chakra-ui/react";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data/image";
import { getIpfsUrl } from "lib/services/utils";

interface NftImageProps extends ImageProps {
  imageUrl: string | undefined;
}

export const NftImage = ({ imageUrl, ...props }: NftImageProps) => (
  <Image
    fallbackSrc={NFT_IMAGE_PLACEHOLDER}
    fallbackStrategy="beforeLoadOrError"
    src={imageUrl ? getIpfsUrl(imageUrl) : undefined}
    {...props}
  />
);
