import type { EvmToAddress, Option } from "lib/types";

import { Text } from "@chakra-ui/react";
import { EvmMethodName } from "lib/types";

import { ExplorerLink } from "../ExplorerLink";
import { EvmToCellCreate } from "./evm-to-cell-create";

interface EvmToCellProps {
  isCompact?: boolean;
  toAddress: Option<EvmToAddress>;
}

export const EvmToCell = ({ isCompact, toAddress }: EvmToCellProps) => {
  if (!toAddress)
    return (
      <Text color="text.dark" variant="body2">
        -
      </Text>
    );

  if (toAddress.toType === EvmMethodName.Create)
    return (
      <EvmToCellCreate
        address={toAddress.address}
        evmTxHash={toAddress.evmTxHash}
        isCompact={isCompact}
      />
    );

  if (toAddress.toType === EvmMethodName.CallErc20Factory)
    return <EvmToCellCreate address={toAddress.address} />;

  return (
    <ExplorerLink
      showCopyOnHover
      type="user_address"
      value={toAddress.address}
    />
  );
};
