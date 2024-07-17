import { Image, useToken } from "@chakra-ui/react";

import { CHAIN_CONFIGS } from "config/chain";

export const NetworkImage = ({
  chainId,
  image,
}: {
  chainId: string;
  image?: string;
}) => {
  const [secondaryDarker] = useToken("colors", ["secondary.darker"]);
  const fallbackImage = `https://ui-avatars.com/api/?name=${CHAIN_CONFIGS[chainId]?.prettyName || chainId}&background=${secondaryDarker.replace("#", "")}&color=fff`;

  return (
    <Image
      w={6}
      h={6}
      borderRadius="full"
      src={image}
      fallbackSrc={fallbackImage}
    />
  );
};
