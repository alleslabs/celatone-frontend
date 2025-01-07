import { Flex, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import {
  useChainConfigs,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useLocalChainConfigStore, useNetworkStore } from "lib/providers/store";

interface NetworkCardCtaProps {
  chainId: string;
  isDraggable?: boolean;
  isSelected: boolean;
}

export const NetworkCardCta = observer(
  ({ chainId, isDraggable, isSelected }: NetworkCardCtaProps) => {
    const navigate = useInternalNavigate();
    const { chainConfigs } = useChainConfigs();
    const { isLocalChainIdExist } = useLocalChainConfigStore();
    const isMobile = useMobile();
    const isEditable = isLocalChainIdExist(chainId);
    const { isNetworkPinned, pinNetwork, removeNetwork } = useNetworkStore();
    const toast = useToast({
      duration: 5000,
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
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
      _hover: isMobile
        ? undefined
        : {
            background: isSelected ? "gray.800" : "gray.900",
            borderRadius: 4,
          },
      align: "center",
      className: "icon-container",
      cursor: "pointer",
      padding: 1,
    };

    return (
      <Flex className="icon-wrapper" gap={2} zIndex={1}>
        {isDraggable && (
          <Flex className="icon-container" align="center" {...opacityStyle}>
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
            onClick={handleSave}
            transition="opacity 0.25s ease-in-out"
          >
            <CustomIcon name="pin" />
          </Flex>
        )}
        {isEditable && (
          <Flex
            {...pinIconStyles}
            onClick={() =>
              navigate({
                pathname: "/custom-network/edit/[chainId]",
                query: {
                  chainId,
                },
              })
            }
          >
            <CustomIcon name="settings" boxSize={6} color="gray.600" />
          </Flex>
        )}
      </Flex>
    );
  }
);
