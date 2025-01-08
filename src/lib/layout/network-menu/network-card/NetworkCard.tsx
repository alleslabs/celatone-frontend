import { Box, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { NetworkImage } from "../NetworkImage";
import {
  useCelatoneApp,
  useChainConfigs,
  useMobile,
  useSelectChain,
} from "lib/app-provider";
import type { Option } from "lib/types";

import { NetworkCardCta } from "./NetworkCardCta";

interface NetworkCardProps {
  chainId: string;
  cursor: Option<number>;
  index?: number;
  isDraggable?: boolean;
  onClose: () => void;
  setCursor: (index: Option<number>) => void;
}

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

export const NetworkCard = observer(
  ({
    chainId,
    cursor,
    index,
    isDraggable = false,
    onClose,
    setCursor,
  }: NetworkCardProps) => {
    const { chainConfigs } = useChainConfigs();
    const isMobile = useMobile();
    const { currentChainId } = useCelatoneApp();
    const selectChain = useSelectChain();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        selectChain(chainId);
        onClose();
      },
      [selectChain, chainId, onClose]
    );

    const isSelected = chainId === currentChainId;
    return (
      <Flex
        id={`item-${index}`}
        alignItems="center"
        gap={4}
        px={4}
        py={2}
        _hover={
          isMobile
            ? undefined
            : {
                "> .icon-wrapper > .icon-container": {
                  opacity: 1,
                },
                background: isSelected ? "gray.700" : "gray.800",
              }
        }
        background={getCardBackground(index, cursor, isSelected)}
        borderRadius={8}
        cursor={getDisplayCursor(isDraggable, isSelected)}
        justifyContent="space-between"
        onClick={handleClick}
        onMouseMove={() => index !== cursor && setCursor(index)}
        position="relative"
        transition="all 0.25s ease-in-out"
      >
        <Box
          width="4px"
          height="60%"
          left="0px"
          bgColor="primary.main"
          borderRadius="2px"
          opacity={isSelected ? 1 : 0}
          position="absolute"
          top="20%"
        />
        <Flex alignItems="center" gap={4}>
          <NetworkImage chainId={chainId} />
          <Flex direction="column">
            <Text variant="body2" fontWeight={600}>
              {chainConfigs[chainId]?.prettyName || chainId}
            </Text>
            <Text variant="body3" color="text.dark">
              {chainId}
            </Text>
          </Flex>
        </Flex>
        <NetworkCardCta
          chainId={chainId}
          isDraggable={isDraggable}
          isSelected={isSelected}
        />
      </Flex>
    );
  }
);
