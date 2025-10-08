import { Box } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { CosmosEvmTxs } from "lib/components/cosmos-evm-txs";
import { MobileTitle } from "lib/components/table";
import { useEvmInternalTxsByAccountAddressSequencer } from "lib/services/evm-internal-txs";
import { useEvmTxsByAccountAddressSequencer } from "lib/services/evm-txs";
import { useTxsByAddressSequencer } from "lib/services/tx";
import { zBechAddr } from "lib/types";
import { useMemo } from "react";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({ address, onViewMore }: TxsTableProps) => {
  const isMobile = useMobile();
  const addressValidation = useMemo(
    () => zBechAddr.safeParse(address),
    [address]
  );
  const cosmosTxsData = useTxsByAddressSequencer(
    addressValidation.data,
    undefined,
    onViewMore ? 5 : 10,
    addressValidation.success
  );
  const evmTxsData = useEvmTxsByAccountAddressSequencer(
    addressValidation.data,
    undefined,
    onViewMore ? 5 : 10,
    addressValidation.success
  );
  const evmInternalTxsData = useEvmInternalTxsByAccountAddressSequencer(
    addressValidation.data,
    onViewMore ? 5 : 10,
    addressValidation.success
  );

  const title = "Transactions";
  const isMobileOverview = isMobile && !!onViewMore;

  if (isMobileOverview)
    return (
      <Box mt={[4, 8]}>
        <MobileTitle
          count={undefined}
          showCount={false}
          title={title}
          onViewMore={onViewMore}
        />
      </Box>
    );

  return (
    <CosmosEvmTxs
      cosmosData={{
        data: cosmosTxsData,
        emptyMessage:
          "There are no transactions on this account, or they have been pruned from the REST.",
        onViewMore,
      }}
      evmData={{
        emptyMessage: "There are no EVM transactions on this account.",
        evmInternalTxsData,
        evmTxsData,
        onViewMore,
        showTimestamp: true,
      }}
    />
  );
};
