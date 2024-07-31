import { Flex, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { useChainConfigs, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useNetworkStore } from "lib/providers/store";

interface NetworkCardCtaProps {
  chainId: string;
  isSelected: boolean;
  isDraggable?: boolean;
}

export const NetworkCardCta = observer(
  ({ chainId, isSelected, isDraggable }: NetworkCardCtaProps) => {
    const { chainConfigs } = useChainConfigs();
    const isMobile = useMobile();
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
        pinNetwork(chainId);
        toast({
          title: `Pinned \u2018${chainConfigs[chainId]?.prettyName}\u2019 successfully`,
        });
      },
      [pinNetwork, chainId, toast, chainConfigs]
    );

    const handleRemove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        removeNetwork(chainId);
        toast({
          title: `\u2018${chainConfigs[chainId]?.prettyName}\u2019 is removed from Pinned Networks`,
        });
      },
      [removeNetwork, chainId, toast, chainConfigs]
    );

    const opacityStyle = {
      opacity: isMobile ? 1 : 0,
    };

    const pinIconStyles = {
      cursor: "pointer",
      className: "icon-container",
      align: "center",
      padding: 1,
      _hover: isMobile
        ? undefined
        : {
            background: isSelected ? "gray.800" : "gray.900",
            borderRadius: 4,
          },
    };

    return (
      <Flex className="icon-wrapper" gap={2} zIndex={1}>
        {isDraggable && (
          <Flex align="center" className="icon-container" {...opacityStyle}>
            <CustomIcon name="drag" color="gray.600" />
          </Flex>
        )}
        {isNetworkPinned(chainId) ? (
          <Flex data-no-dnd="true" {...pinIconStyles} onClick={handleRemove}>
            <CustomIcon name="pin-solid" />
          </Flex>
        ) : (
          <Flex
            {...pinIconStyles}
            {...opacityStyle}
            transition="opacity 0.25s ease-in-out"
            onClick={handleSave}
          >
            <CustomIcon name="pin" />
          </Flex>
        )}
      </Flex>
    );
  }
);
