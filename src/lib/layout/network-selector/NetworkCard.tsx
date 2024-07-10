import { Box, Flex, Image, Text, useToast, useToken } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useSelectChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useNetworkStore } from "lib/providers/store";
import type { Option } from "lib/types";

interface NetworkCardProps {
  image?: string;
  chainId: string;
  isSelected: boolean;
  isDraggable?: boolean;
  index?: number;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
}

const iconProps = {
  cursor: "pointer",
  className: "icon-container",
  align: "center",
  padding: 1,
};

const customTransition = "opacity 0.1s ease-in-out";

export const NetworkCard = observer(
  ({
    image,
    chainId,
    isSelected,
    isDraggable = false,
    index,
    cursor,
    setCursor,
  }: NetworkCardProps) => {
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

    const handleSave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        pinNetwork({
          name: CHAIN_CONFIGS[chainId]?.prettyName,
          chainId,
          logo: image || fallbackImage,
          id: "",
        });
        toast({
          title: `Pinned \u2018${CHAIN_CONFIGS[chainId]?.prettyName}\u2019 successfully`,
        });
      },
      [pinNetwork, image, chainId, toast, fallbackImage]
    );

    const handleRemove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        removeNetwork(chainId);
        toast({
          title: `\u2018${CHAIN_CONFIGS[chainId]?.prettyName}\u2019 is removed from Pinned Networks`,
        });
      },
      [removeNetwork, chainId, toast]
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        selectChain(chainId);
      },
      [selectChain, chainId]
    );

    let cardBackground;

    if (isSelected) {
      cardBackground = "gray.700";
    } else if (index === cursor) {
      cardBackground = "gray.800";
    } else {
      cardBackground = "transparent";
    }

    return (
      <Flex
        id={`item-${index}`}
        position="relative"
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={2}
        gap={4}
        borderRadius={8}
        transition="all 0.25s ease-in-out"
        background={cardBackground}
        _hover={{
          background: !isSelected && "gray.800",
          "> .icon-wrapper > .icon-container": {
            opacity: 1,
          },
        }}
        onMouseMove={() => index !== cursor && setCursor(index)}
        onClick={handleClick}
        cursor={!isDraggable ? "pointer" : "inherit"}
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
        <Flex className="icon-wrapper" gap={2} zIndex={1}>
          {isDraggable && (
            <Flex
              align="center"
              className="icon-container"
              opacity={0}
              _hover={{ opacity: 1, transition: customTransition }}
            >
              <CustomIcon name="drag" color="gray.600" />
            </Flex>
          )}
          {isNetworkPinned(chainId) ? (
            <Flex
              data-no-dnd="true"
              {...iconProps}
              onClick={handleRemove}
              _hover={{
                background: isSelected ? "gray.800" : "gray.900",
                borderRadius: 4,
                transition: customTransition,
              }}
            >
              <CustomIcon name="pin-solid" />
            </Flex>
          ) : (
            <Flex
              {...iconProps}
              onClick={handleSave}
              sx={{ opacity: 0, transition: "opacity 0.25s ease-in-out" }}
              _hover={{
                background: isSelected ? "gray.800" : "gray.900",
                borderRadius: 4,
                transition: customTransition,
              }}
            >
              <CustomIcon name="pin" />
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  }
);
