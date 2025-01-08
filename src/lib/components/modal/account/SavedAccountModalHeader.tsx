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
    <Flex gap={1} direction="column">
      <Flex alignItems="center" gap={4} pt={6}>
        <Text minW={32} variant="body2" color="text.main" fontWeight={500}>
          Account Address
        </Text>
        <ExplorerLink type="user_address" value={address} />
      </Flex>
      {move.enabled && (
        <Flex alignItems="center" gap={4}>
          <Text minW={32} variant="body2" color="text.main" fontWeight={500}>
            Hex Address
          </Text>
          <ExplorerLink
            type="user_address"
            value={unpadHexAddress(bech32AddressToHex(address))}
          />
        </Flex>
      )}
    </Flex>
  );
};
