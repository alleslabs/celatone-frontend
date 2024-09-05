import { Flex, Text } from "@chakra-ui/react";

import type { getEvmToAddress } from "lib/utils";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

interface EvmToCellProps {
  toAddress: ReturnType<typeof getEvmToAddress>;
}

export const EvmToCell = ({ toAddress }: EvmToCellProps) => {
  if (toAddress?.isCreatedContract)
    return (
      <Flex direction="column">
        <Text variant="body3" color="text.disabled">
          Created Contract
        </Text>
        <Flex gap={1} align="center">
          <CustomIcon
            name="contract-address"
            boxSize={3}
            color="primary.main"
          />
          <ExplorerLink
            value={toAddress.address}
            type={toAddress.type}
            showCopyOnHover
          />
        </Flex>
      </Flex>
    );

  if (toAddress)
    return (
      <ExplorerLink
        value={toAddress.address}
        type={toAddress.type}
        showCopyOnHover
      />
    );

  return (
    <Text variant="body2" color="text.dark">
      -
    </Text>
  );
};
