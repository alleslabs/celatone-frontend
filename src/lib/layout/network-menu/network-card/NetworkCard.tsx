import type { Option } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useCelatoneApp, useChainConfigs, useMobile } from "lib/app-provider";
import { observer } from "mobx-react-lite";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { NetworkImage } from "../NetworkImage";
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
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { chainConfigs } = useChainConfigs();
    const isMobile = useMobile();
    const { currentChainId } = useCelatoneApp();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const redirectionEndpoint =
          pathname.replace(`/${currentChainId}`, `/${chainId}`) +
          `?${searchParams.toString()}`;

        window.location.href = redirectionEndpoint;
        onClose();
      },
      [chainId, currentChainId, onClose, pathname, searchParams]
    );

    const isSelected = chainId === currentChainId;
    return (
      <Flex
        id={`item-${index}`}
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
        alignItems="center"
        background={getCardBackground(index, cursor, isSelected)}
        borderRadius={8}
        cursor={getDisplayCursor(isDraggable, isSelected)}
        gap={4}
        justifyContent="space-between"
        position="relative"
        px={4}
        py={2}
        transition="all 0.25s ease-in-out"
        onClick={handleClick}
        onMouseMove={() => index !== cursor && setCursor(index)}
      >
        <Box
          bgColor="primary.main"
          borderRadius="2px"
          height="60%"
          left="0px"
          opacity={isSelected ? 1 : 0}
          position="absolute"
          top="20%"
          width="4px"
        />
        <Flex alignItems="center" gap={4}>
          <NetworkImage chainId={chainId} />
          <Flex direction="column">
            <Text fontWeight={600} variant="body2">
              {chainConfigs[chainId]?.prettyName || chainId}
            </Text>
            <Text color="text.dark" variant="body3">
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
