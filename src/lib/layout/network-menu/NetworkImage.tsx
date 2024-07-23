import { Image, useToken } from "@chakra-ui/react";

import { CHAIN_CONFIGS } from "config/chain";

interface NetworkImageProps {
  chainId: string;
}

export const NetworkImage = ({ chainId }: NetworkImageProps) => {
  const [secondaryDarker] = useToken("colors", ["secondary.darker"]);

  const image = CHAIN_CONFIGS[chainId]?.logoUrl;
  const fallbackImage = `https://ui-avatars.com/api/?name=${CHAIN_CONFIGS[chainId]?.prettyName || chainId}&background=${secondaryDarker.replace("#", "")}&color=fff`;

  return (
    <Image
      w={6}
      h={6}
      borderRadius="full"
      src={image ?? fallbackImage}
      fallbackSrc={fallbackImage}
      fallbackStrategy="onError"
    />
  );
};
