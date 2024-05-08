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
      justifyContent="space-between"
      w="full"
      bgColor="gray.800"
      px={4}
      py={3}
      mb={6}
      borderRadius={8}
      alignItems="center"
    >
      {isMobile ? (
        <>
          <Flex direction="column" gap={1}>
            <Flex alignItems="center" gap={2}>
              <Text variant="body2" color="text.dark">
                VM Address:
              </Text>
              <CopyLink
                value={selectedAddress.address}
                type="user_address"
                isTruncate
              />
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text variant="body2" color="text.dark">
                HEX Address:
              </Text>
              <CopyLink
                value={selectedAddress.hex}
                type="user_address"
                isTruncate
              />
            </Flex>
          </Flex>
          <IconButton
            variant="outline-white"
            onClick={() => setMode("input")}
            icon={<CustomIcon name="swap" boxSize={3} />}
            aria-label="reattach schema"
          />
        </>
      ) : (
        <>
          {" "}
          <Flex flex={1}>
            <LabelText label="Viewing Address">
              <CopyLink
                value={selectedAddress.address}
                type="user_address"
                showCopyOnHover
              />
            </LabelText>
          </Flex>
          <Flex flex={1}>
            <LabelText label="Hex">
              <CopyLink
                value={selectedAddress.hex}
                type="user_address"
                showCopyOnHover
              />
            </LabelText>
          </Flex>
          <Button
            variant="outline-white"
            size="sm"
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
