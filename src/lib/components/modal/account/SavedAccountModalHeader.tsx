import { Flex, Text } from "@chakra-ui/react";

import { useMoveConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { BechAddr } from "lib/types";
import { bech32AddressToHex, unpadHexAddress } from "lib/utils";

interface SavedAccountModalHeaderProps {
  address: BechAddr;
}

export const SavedAccountModalHeader = ({
  address,
}: SavedAccountModalHeaderProps) => {
  const move = useMoveConfig({ shouldRedirect: false });
  return (
    <Flex direction="column" gap={1}>
      <Flex gap={4} alignItems="center" pt={6}>
        <Text variant="body2" fontWeight={500} color="text.main" minW={32}>
          Account address
        </Text>
        <ExplorerLink value={address} type="user_address" />
      </Flex>
      {move.enabled && (
        <Flex gap={4} alignItems="center">
          <Text variant="body2" fontWeight={500} color="text.main" minW={32}>
            Hex address
          </Text>
          <ExplorerLink
            value={unpadHexAddress(bech32AddressToHex(address))}
            type="user_address"
          />
        </Flex>
      )}
    </Flex>
  );
};
