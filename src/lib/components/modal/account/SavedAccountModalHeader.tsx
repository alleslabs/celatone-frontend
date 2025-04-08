import type { BechAddr } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useMoveConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
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
      <Flex alignItems="center" gap={4} pt={6}>
        <Text color="text.main" fontWeight={500} minW={32} variant="body2">
          Account address
        </Text>
        <ExplorerLink type="user_address" value={address} />
      </Flex>
      {move.enabled && (
        <Flex alignItems="center" gap={4}>
          <Text color="text.main" fontWeight={500} minW={32} variant="body2">
            Hex address
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
