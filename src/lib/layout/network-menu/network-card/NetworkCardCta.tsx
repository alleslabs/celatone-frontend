import { Flex, useToast } from "@chakra-ui/react";
import {
  useChainConfigs,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useLocalChainConfigStore, useNetworkStore } from "lib/providers/store";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

interface NetworkCardCtaProps {
  chainId: string;
  isSelected: boolean;
  isDraggable?: boolean;
}

export const NetworkCardCta = observer(
  ({ chainId, isSelected, isDraggable }: NetworkCardCtaProps) => {
    const navigate = useInternalNavigate();
    const { chainConfigs } = useChainConfigs();
    const { isLocalChainIdExist } = useLocalChainConfigStore();
    const isMobile = useMobile();
    const isEditable = isLocalChainIdExist(chainId);
    const { isNetworkPinned, pinNetwork, removeNetwork } = useNetworkStore();
    const toast = useToast({
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
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
          <Flex className="icon-container" align="center" {...opacityStyle}>
            <CustomIcon color="gray.600" name="drag" />
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
        {isEditable && (
          <Flex
            {...pinIconStyles}
            onClick={(e) => {
              e.stopPropagation();
              navigate({
                pathname: "/custom-network/edit/[chainId]",
                query: {
                  chainId,
                },
              });
            }}
          >
            <CustomIcon boxSize={6} color="gray.600" name="settings" />
          </Flex>
        )}
      </Flex>
    );
  }
);
