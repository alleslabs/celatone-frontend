import { Flex, Grid, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { TableRow } from "../tableComponents";
import { useInternalNavigate } from "lib/app-provider";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { EvmToCell } from "lib/components/EvmToCell";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";
import {
  coinToTokenWithValue,
  dateFromNow,
  formatEvmTxHash,
  formatPrice,
  formatUTC,
  formatUTokenWithPrecision,
  getEvmAmount,
  getEvmToAddress,
  getTokenLabel,
} from "lib/utils";

interface EvmTransactionsTableRowProps {
  templateColumns: string;
  evmTransaction: TxDataWithTimeStampJsonRpc;
  evmDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  showTimestamp: boolean;
}

export const EvmTransactionsTableRow = ({
  templateColumns,
  evmTransaction,
  evmDenom,
  assetInfos,
  showTimestamp,
}: EvmTransactionsTableRowProps) => {
  const navigate = useInternalNavigate();
  const toAddress = getEvmToAddress(evmTransaction);
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
      templateColumns={templateColumns}
      onClick={() => onRowSelect(formatEvmTxHash(evmTransaction.tx.hash))}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
    >
      <TableRow />
      <TableRow pr={1}>
        <ExplorerLink
          value={formatEvmTxHash(evmTransaction.tx.hash)}
          type="evm_tx_hash"
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        {evmTransaction.txReceipt.status ? (
          <CustomIcon name="check" color="success.main" />
        ) : (
          <CustomIcon name="close" color="error.main" />
        )}
      </TableRow>
      <TableRow>
        <EvmMethodChip txInput={evmTransaction.tx.input} width="120px" />
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={evmTransaction.tx.from}
          type="user_address"
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <CustomIcon name="arrow-right" boxSize={5} color="gray.600" />
      </TableRow>
      <TableRow>
        <EvmToCell toAddress={toAddress} />
      </TableRow>
      <TableRow flexDirection="column" alignItems="start">
        <Text variant="body2">
          <Text as="span" fontWeight={700} mr={1}>
            {formatUTokenWithPrecision(
              token.amount,
              token.precision ?? 0,
              true
            )}
          </Text>
          {getTokenLabel(token.denom, token.symbol)}
        </Text>
        <Text variant="body3" color="text.dark">
          {!isUndefined(token.value) ? `(${formatPrice(token.value)})` : "N/A"}
        </Text>
      </TableRow>
      {showTimestamp && (
        <TableRow>
          <Flex direction="column">
            <Text variant="body2" color="text.dark">
              {formatUTC(evmTransaction.timestamp)}
            </Text>
            <Text variant="body3" color="text.disabled">
              ({dateFromNow(evmTransaction.timestamp)})
            </Text>
          </Flex>
        </TableRow>
      )}
    </Grid>
  );
};