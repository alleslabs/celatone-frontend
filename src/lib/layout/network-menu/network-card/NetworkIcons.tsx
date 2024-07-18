import { Flex, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { CustomIcon } from "lib/components/icon";
import { useNetworkStore } from "lib/providers/store";

const customTransition = "opacity 0.1s ease-in-out";

const iconProps = {
  cursor: "pointer",
  className: "icon-container",
  align: "center",
  padding: 1,
};

interface NetworkIconsProps {
  chainId: string;
  isSelected: boolean;
  image?: string;
  isDraggable?: boolean;
}

export const NetworkIcons = observer(
  ({ chainId, isSelected, image, isDraggable }: NetworkIconsProps) => {
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

    return (
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
  }
);
