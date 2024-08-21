import { Image, useToken } from "@chakra-ui/react";

import { useChainConfigs } from "lib/app-provider";

interface NetworkImageProps {
  chainId: string;
}

export const NetworkImage = ({ chainId }: NetworkImageProps) => {
  const { chainConfigs } = useChainConfigs();
  const [primaryDark] = useToken("colors", ["primary.dark"]);

  const image = chainConfigs[chainId]?.logoUrl;
  const fallbackImage = `https://ui-avatars.com/api/?name=${chainConfigs[chainId]?.prettyName || chainId}&background=${primaryDark.replace("#", "")}&color=fff`;

  return (
    <Image
      objectFit="cover"
      w={6}
      h={6}
      borderRadius="full"
      src={image || fallbackImage}
      fallbackSrc={fallbackImage}
      fallbackStrategy="onError"
    />
  );
};
