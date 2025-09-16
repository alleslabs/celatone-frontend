import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  coinToTokenWithValue,
  formatEvmTxHash,
  formatUTokenWithPrecision,
  getEvmAmount,
} from "lib/utils";

import { TableRow } from "../tableComponents";

interface EvmTransactionsTableRowProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmTransaction: TxDataWithTimeStampJsonRpc;
  templateColumns: string;
}

export const EvmTransactionsTableRow = ({
  assetInfos,
  evmDenom,
  evmTransaction,
  templateColumns,
}: EvmTransactionsTableRowProps) => {
  const navigate = useInternalNavigate();
  const { amount, denom } = getEvmAmount(evmTransaction, evmDenom);

  const onRowSelect = (txHash: string) =>
    navigate({
      pathname: "/evm-txs/[txHash]",
      query: { txHash },
    });

  const token = coinToTokenWithValue(denom, amount, assetInfos);
  return (
    <Grid
      className="copier-wrapper"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={() => onRowSelect(formatEvmTxHash(evmTransaction.tx.hash))}
    >
      <TableRow gap={1} pr={1}>
        {evmTransaction.txReceipt.status ? (
          <CustomIcon
            boxSize={3}
            color="success.main"
            name="check-circle-solid"
          />
        ) : (
          <CustomIcon
            boxSize={3}
            color="error.main"
            name="close-circle-solid"
          />
        )}
        <ExplorerLink
          showCopyOnHover
          type="evm_tx_hash"
          value={formatEvmTxHash(evmTransaction.tx.hash)}
        />
      </TableRow>
      <TableRow>
        <EvmMethodChip
          txInput={evmTransaction.tx.input}
          txTo={evmTransaction.tx.to}
        />
      </TableRow>
      <TableRow>
        <ExplorerLink
          showCopyOnHover
          type="user_address"
          value={evmTransaction.tx.from}
        />
      </TableRow>
      <TableRow
        alignItems="start"
        flexDirection="column"
        justifyContent="center"
      >
        <Text color="text.dark" variant="body2">
          {formatUTokenWithPrecision({
            amount: token.amount,
            precision: token.precision ?? 0,
          })}{" "}
          GAS
        </Text>
      </TableRow>
    </Grid>
  );
};
