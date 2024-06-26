import { Box, Flex, Image, Text, useToast, useToken } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useSelectChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useNetworkStore } from "lib/providers/store";

interface NetworkCardProps {
  image?: string;
  chainId: string;
  isSelected: boolean;
}

export const NetworkCard = observer(
  ({ image, chainId, isSelected }: NetworkCardProps) => {
    const selectChain = useSelectChain();
    const [secondaryDarker] = useToken("colors", ["secondary.darker"]);
    const fallbackImage = `https://ui-avatars.com/api/?name=${CHAIN_CONFIGS[chainId]?.prettyName || chainId}&background=${secondaryDarker.replace("#", "")}&color=fff`;
    const { isNetworkPinned, pinNetwork, removeNetwork } = useNetworkStore();

    const toast = useToast({
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });

    const handleSave = useCallback(() => {
      pinNetwork({
        name: CHAIN_CONFIGS[chainId]?.prettyName,
        chainId,
        logo: image || fallbackImage,
      });
      toast({
        title: `Pinned \u2018${CHAIN_CONFIGS[chainId]?.prettyName}\u2019 successfully`,
      });
    }, [pinNetwork, image, chainId, toast, fallbackImage]);

    const handleRemove = useCallback(() => {
      removeNetwork(chainId);
      toast({
        title: `\u2018${CHAIN_CONFIGS[chainId]?.prettyName}\u2019 is removed from Pinned Networks`,
      });
    }, [removeNetwork, chainId, toast]);

    return (
      <Flex
        position="relative"
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={2}
        gap={4}
        borderRadius={8}
        cursor="pointer"
        transition="all 0.25s ease-in-out"
        background={isSelected ? "gray.700" : "transparent"}
        _hover={{
          background: !isSelected && "gray.800",
          "> .icon-container": {
            opacity: 1,
          },
        }}
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
        <Flex alignItems="center" gap={4}>
          <Image
            w={6}
            h={6}
            borderRadius="full"
            src={image}
            fallbackSrc={fallbackImage}
          />
          <Flex direction="column">
            <Text variant="body2" fontWeight={600}>
              {CHAIN_CONFIGS[chainId]?.prettyName || chainId}
            </Text>
            <Text color="text.dark" variant="body3">
              {chainId}
            </Text>
          </Flex>
        </Flex>
        {isNetworkPinned(chainId) ? (
          <Flex
            className="icon-container"
            align="center"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <CustomIcon name="pin-solid" className="pin-network-icon" />
          </Flex>
        ) : (
          <Flex
            className="icon-container"
            align="center"
            onClick={(e) => {
              if (chainId) {
                e.stopPropagation();
                handleSave();
              }
            }}
            sx={{ opacity: 0, transition: "opacity 0.25s ease-in-out" }}
          >
            <CustomIcon name="pin" className="pin-network-icon" />
          </Flex>
        )}
        {/* <CustomIcon name="pin-solid" /> */}
      </Flex>
    );
  }
);
