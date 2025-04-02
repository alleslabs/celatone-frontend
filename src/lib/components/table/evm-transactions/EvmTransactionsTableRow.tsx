import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { EvmToCell } from "lib/components/evm-to-cell";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
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
import { isUndefined } from "lodash";

import { TableRow } from "../tableComponents";

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
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={() => onRowSelect(formatEvmTxHash(evmTransaction.tx.hash))}
    >
      <TableRow />
      <TableRow pr={1}>
        <ExplorerLink
          showCopyOnHover
          type="evm_tx_hash"
          value={formatEvmTxHash(evmTransaction.tx.hash)}
        />
      </TableRow>
      <TableRow>
        {evmTransaction.txReceipt.status ? (
          <CustomIcon color="success.main" name="check" />
        ) : (
          <CustomIcon color="error.main" name="close" />
        )}
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
      <TableRow>
        <CustomIcon boxSize={5} color="gray.600" name="arrow-right" />
      </TableRow>
      <TableRow>
        <EvmToCell isCompact toAddress={toAddress} />
      </TableRow>
      <TableRow
        alignItems="start"
        flexDirection="column"
        justifyContent="center"
      >
        <Text variant="body2">
          <Text as="span" fontWeight={700} mr={1}>
            {formatUTokenWithPrecision(
              token.amount,
              token.precision ?? 0,
              true,
              token.precision ? 6 : 0
            )}
          </Text>
          {getTokenLabel(token.denom, token.symbol)}
        </Text>
        {!isUndefined(token.value) && (
          <Text color="text.dark" variant="body3">
            ({formatPrice(token.value)})
          </Text>
        )}
      </TableRow>
      {showTimestamp && (
        <TableRow>
          <Flex direction="column">
            <Text color="text.dark" variant="body2">
              {formatUTC(evmTransaction.timestamp)}
            </Text>
            <Text color="text.disabled" variant="body3">
              ({dateFromNow(evmTransaction.timestamp)})
            </Text>
          </Flex>
        </TableRow>
      )}
    </Grid>
  );
};
