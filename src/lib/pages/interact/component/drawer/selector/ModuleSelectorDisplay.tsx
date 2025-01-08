import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { DisplayMode, SelectedAddress } from "../types";
import { useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";

interface ModuleSelectorDisplayProps {
  selectedAddress: SelectedAddress;
  setMode: Dispatch<SetStateAction<DisplayMode>>;
}

export const ModuleSelectorDisplay = ({
  selectedAddress,
  setMode,
}: ModuleSelectorDisplayProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      className="selector-display"
      alignItems="center"
      mb={6}
      px={4}
      py={3}
      w="full"
      bgColor="gray.800"
      borderRadius={8}
      justifyContent="space-between"
    >
      {isMobile ? (
        <>
          <Flex gap={1} direction="column">
            <Flex alignItems="center" gap={2}>
              <Text variant="body2" color="text.dark">
                VM Address:
              </Text>
              <CopyLink
                isTruncate
                type="user_address"
                value={selectedAddress.address}
              />
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text variant="body2" color="text.dark">
                HEX Address:
              </Text>
              <CopyLink
                isTruncate
                type="user_address"
                value={selectedAddress.hex}
              />
            </Flex>
          </Flex>
          <IconButton
            aria-label="reattach schema"
            variant="outline-white"
            icon={<CustomIcon name="swap" boxSize={3} />}
            onClick={() => setMode("input")}
          />
        </>
      ) : (
        <>
          <Flex flex={1}>
            <LabelText label="Viewing Address">
              <CopyLink
                type="user_address"
                value={selectedAddress.address}
                showCopyOnHover
              />
            </LabelText>
          </Flex>
          <Flex flex={1}>
            <LabelText label="Hex">
              <CopyLink
                type="user_address"
                value={selectedAddress.hex}
                showCopyOnHover
              />
            </LabelText>
          </Flex>
          <Button
            size="sm"
            variant="outline-white"
            leftIcon={<CustomIcon name="swap" boxSize={3} />}
            onClick={() => setMode("input")}
          >
            Change Address
          </Button>
        </>
      )}
    </Flex>
  );
};
