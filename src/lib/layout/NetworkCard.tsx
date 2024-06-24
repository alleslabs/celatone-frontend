import { Box, Flex, Image, Text, useToken } from "@chakra-ui/react";

import { CHAIN_CONFIGS } from "config/chain";
import { useSelectChain } from "lib/app-provider";

interface NetworkCardProps {
  image?: string;
  chainId: string;
  isSelected: boolean;
}

export const NetworkCard = ({
  image,
  chainId,
  isSelected,
}: NetworkCardProps) => {
  const selectChain = useSelectChain();
  const [secondaryDarker] = useToken("colors", ["secondary.darker"]);
  const fallbackImage = `https://ui-avatars.com/api/?name=${CHAIN_CONFIGS[chainId]?.prettyName || chainId}&background=${secondaryDarker.replace("#", "")}&color=fff`;

  return (
    <Flex
      alignItems="center"
      position="relative"
      px={4}
      py={2}
      gap={4}
      borderRadius={8}
      cursor="pointer"
      transition="all 0.25s ease-in-out"
      background={isSelected ? "gray.700" : "transparent"}
      _hover={{ background: !isSelected && "gray.800" }}
      onClick={() => selectChain(chainId)}
    >
      <Box
        opacity={isSelected ? 1 : 0}
        width="4px"
        height="60%"
        bgColor="primary.main"
        position="absolute"
        top="20%"
        borderRadius="2px"
        left="0px"
      />
      <Image
        w={6}
        h={6}
        borderRadius="full"
        src={image}
        fallbackSrc={fallbackImage}
      />
      <Flex direction="column">
        <Text variant="body1" fontWeight={600}>
          {CHAIN_CONFIGS[chainId]?.prettyName || chainId}
        </Text>
        <Text color="text.dark" variant="body2">
          {chainId}
        </Text>
      </Flex>
    </Flex>
  );
};
