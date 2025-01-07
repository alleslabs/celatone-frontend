import { Flex, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";
import type { EvmToAddress } from "lib/utils";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

interface EvmToCellProps {
  toAddress: Option<EvmToAddress>;
}

export const EvmToCell = ({ toAddress }: EvmToCellProps) => {
  if (toAddress?.isCreatedContract)
    return (
      <Flex direction="column">
        <Text variant="body3" color="text.disabled">
          Created Contract
        </Text>
        <Flex align="center" gap={1}>
          <CustomIcon
            name="contract-address"
            boxSize={3}
            color="primary.main"
          />
          <ExplorerLink
            type={toAddress.type}
            value={toAddress.address}
            showCopyOnHover
          />
        </Flex>
      </Flex>
    );

  if (toAddress)
    return (
      <ExplorerLink
        type={toAddress.type}
        value={toAddress.address}
        showCopyOnHover
      />
    );

  return (
    <Text variant="body2" color="text.dark">
      -
    </Text>
  );
};
