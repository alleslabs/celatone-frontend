import { Text } from "@chakra-ui/react";

import type { EvmToAddress, Option } from "lib/types";
import { EvmMethodName } from "lib/types";

import { ExplorerLink } from "../ExplorerLink";
import { EvmToCellCreate } from "./evm-to-cell-create";

interface EvmToCellProps {
  toAddress: Option<EvmToAddress>;
  isCompact?: boolean;
}

export const EvmToCell = ({ toAddress, isCompact }: EvmToCellProps) => {
  if (!toAddress)
    return (
      <Text variant="body2" color="text.dark">
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
      value={toAddress.address}
      type="user_address"
      showCopyOnHover
    />
  );
};
