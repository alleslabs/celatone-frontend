import type { Dispatch, SetStateAction } from "react";

import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";

import type { DisplayMode, SelectedAddress } from "../types";

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
      bgColor="gray.800"
      borderRadius={8}
      justifyContent="space-between"
      mb={6}
      px={4}
      py={3}
      w="full"
    >
      {isMobile ? (
        <>
          <Flex direction="column" gap={1}>
            <Flex alignItems="center" gap={2}>
              <Text color="text.dark" variant="body2">
                VM Address:
              </Text>
              <CopyLink
                isTruncate
                type="user_address"
                value={selectedAddress.address}
              />
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text color="text.dark" variant="body2">
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
            icon={<CustomIcon boxSize={3} name="swap" />}
            variant="outline-white"
            onClick={() => setMode("input")}
          />
        </>
      ) : (
        <>
          <Flex flex={1}>
            <LabelText label="Viewing Address">
              <CopyLink
                showCopyOnHover
                type="user_address"
                value={selectedAddress.address}
              />
            </LabelText>
          </Flex>
          <Flex flex={1}>
            <LabelText label="Hex">
              <CopyLink
                showCopyOnHover
                type="user_address"
                value={selectedAddress.hex}
              />
            </LabelText>
          </Flex>
          <Button
            leftIcon={<CustomIcon boxSize={3} name="swap" />}
            size="sm"
            variant="outline-white"
            onClick={() => setMode("input")}
          >
            Change Address
          </Button>
        </>
      )}
    </Flex>
  );
};
