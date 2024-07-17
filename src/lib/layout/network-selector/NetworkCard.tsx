import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useSelectChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useNetworkStore } from "lib/providers/store";
import type { Option } from "lib/types";

import { NetworkImage } from "./NetworkImage";

interface NetworkCommonProps {
  chainId: string;
  isSelected: boolean;
  isDraggable?: boolean;
}

interface NetworkCardProps extends NetworkCommonProps {
  image?: string;
  index?: number;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  onClose: () => void;
}

interface NetworkIconsProps extends NetworkCommonProps {
  handleSave: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleRemove: (e: React.MouseEvent<HTMLDivElement>) => void;
  isNetworkPinned: (chainId: string) => boolean;
}

const customTransition = "opacity 0.1s ease-in-out";

const iconProps = {
  cursor: "pointer",
  className: "icon-container",
  align: "center",
  padding: 1,
};

const getCardBackground = (
  index?: number,
  cursor?: Option<number>,
  isSelected?: boolean
) => {
  if (index === cursor) {
    return "gray.800";
  }
  if (isSelected) {
    return "gray.700";
  }
  return "transparent";
};

const getDisplayCursor = (isDraggable: boolean, isSelected: boolean) => {
  if (isDraggable) {
    return "inherit";
  }
  if (isSelected) {
    return "default";
  }
  return "pointer";
};

const useHandleToast = () => {
  return useToast({
    status: "success",
    duration: 5000,
    isClosable: false,
    position: "bottom-right",
    icon: <CustomIcon name="check-circle-solid" color="success.main" />,
  });
};

const NetworkIcons = ({
  chainId,
  isSelected,
  isDraggable,
  handleSave,
  handleRemove,
  isNetworkPinned,
}: NetworkIconsProps) => (
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
);

export const NetworkCard = observer(
  ({
    image,
    chainId,
    isSelected,
    isDraggable = false,
    index,
    cursor,
    setCursor,
    onClose,
  }: NetworkCardProps) => {
    const selectChain = useSelectChain();
    const { isNetworkPinned, pinNetwork, removeNetwork } = useNetworkStore();

    const toast = useHandleToast();

    const handleSave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        pinNetwork({
          name: CHAIN_CONFIGS[chainId]?.prettyName,
          chainId,
          logo: image,
          id: "",
        });
        toast({
          title: `Pinned \u2018${CHAIN_CONFIGS[chainId]?.prettyName}\u2019 successfully`,
        });
      },
      [pinNetwork, image, chainId, toast]
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
        onClose();
      },
      [selectChain, chainId, onClose]
    );

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
        onClick={handleClick}
        background={getCardBackground(index, cursor, isSelected)}
        cursor={getDisplayCursor(isDraggable, isSelected)}
        onMouseMove={() => index !== cursor && setCursor(index)}
        _hover={{
          background: isSelected ? "gray.700" : "gray.800",
          "> .icon-wrapper > .icon-container": {
            opacity: 1,
          },
        }}
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
          <NetworkImage chainId={chainId} image={image} />
          <Flex direction="column">
            <Text variant="body2" fontWeight={600}>
              {CHAIN_CONFIGS[chainId]?.prettyName || chainId}
            </Text>
            <Text color="text.dark" variant="body3">
              {chainId}
            </Text>
          </Flex>
        </Flex>
        <NetworkIcons
          chainId={chainId}
          isSelected={isSelected}
          isDraggable={isDraggable}
          handleSave={handleSave}
          handleRemove={handleRemove}
          isNetworkPinned={isNetworkPinned}
        />
      </Flex>
    );
  }
);
