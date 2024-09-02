import { Flex, Text } from "@chakra-ui/react";

import type { HexAddr20, Nullable } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

interface EvmToCellProps {
  to: Nullable<HexAddr20>;
  contractAddress: Nullable<HexAddr20>;
}

export const EvmToCell = ({ to, contractAddress }: EvmToCellProps) => {
  if (contractAddress)
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
            value={contractAddress}
            type="evm_contract_address"
            showCopyOnHover
          />
        </Flex>
      </Flex>
    );

  if (to)
    return <ExplorerLink value={to} type="user_address" showCopyOnHover />;

  return (
    <Text variant="body2" color="text.dark">
      -
    </Text>
  );
};
