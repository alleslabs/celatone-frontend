import { Image, useToken } from "@chakra-ui/react";

import { useChainConfigs } from "lib/app-provider";

interface NetworkImageProps {
  chainId: string;
}

export const NetworkImage = ({ chainId }: NetworkImageProps) => {
  const { chainConfigs } = useChainConfigs();
  const [secondaryDarker] = useToken("colors", ["secondary.darker"]);

  const image = chainConfigs[chainId]?.logoUrl;
  const fallbackImage = `https://ui-avatars.com/api/?name=${chainConfigs[chainId]?.prettyName || chainId}&background=${secondaryDarker.replace("#", "")}&color=fff`;

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
