import { Button, Flex, Text } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { DisplayMode, SelectedAddress } from "../types";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";

interface ModuleSelectorDisplayProps {
  selectedAddress: SelectedAddress;
  setMode: Dispatch<SetStateAction<DisplayMode>>;
}

export const ModuleSelectorDisplay = ({
  selectedAddress,
  setMode,
}: ModuleSelectorDisplayProps) => (
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
    <Flex direction="column" gap={1}>
      <Text variant="body2" color="text.dark" fontWeight={500}>
        Viewing Address
      </Text>
      <CopyLink value={selectedAddress.address} type="user_address" />
    </Flex>
    <Flex direction="column" gap={1}>
      <Text variant="body2" color="text.dark" fontWeight={500}>
        Hex
      </Text>
      <CopyLink value={selectedAddress.hex} type="user_address" />
    </Flex>
    <div />
    <Button
      variant="outline-white"
      size="sm"
      leftIcon={<CustomIcon name="swap" boxSize={3} />}
      onClick={() => setMode("input")}
    >
      Change Address
    </Button>
  </Flex>
);
