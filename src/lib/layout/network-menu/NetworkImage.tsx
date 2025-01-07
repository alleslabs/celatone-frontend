import { Image, useToken } from "@chakra-ui/react";

import { useChainConfigs } from "lib/app-provider";

interface NetworkImageProps {
  chainId: string;
}

export const NetworkImage = ({ chainId }: NetworkImageProps) => {
  const { chainConfigs } = useChainConfigs();
  const [primaryDark] = useToken("colors", ["primary.dark"]);

  const logoUris = chainConfigs[chainId]?.logo_URIs;
  const fallbackImage = `https://ui-avatars.com/api/?name=${chainConfigs[chainId]?.prettyName || chainId}&background=${primaryDark.replace("#", "")}&color=fff`;
  const image =
    logoUris?.png || logoUris?.svg || logoUris?.jpeg || fallbackImage;

  return (
    <Image
      fallbackSrc={fallbackImage}
      fallbackStrategy="onError"
      h={6}
      src={image}
      w={6}
      borderRadius="full"
      objectFit="cover"
    />
  );
};
