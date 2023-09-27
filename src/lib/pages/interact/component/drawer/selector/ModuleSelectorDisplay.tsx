import { Flex, Button } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { DisplayMode, SelectedAddress } from "../types";
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
    <LabelText flex={1} label="Viewing Address">
      <CopyLink
        value={selectedAddress.address}
        type="user_address"
        w="fit-content"
        showCopyOnHover
      />
    </LabelText>
    <LabelText flex={1} label="Hex">
      <CopyLink
        value={selectedAddress.hex}
        type="user_address"
        w="fit-content"
        showCopyOnHover
      />
    </LabelText>
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
