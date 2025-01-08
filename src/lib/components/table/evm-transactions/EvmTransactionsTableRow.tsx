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
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmTransaction: TxDataWithTimeStampJsonRpc;
  showTimestamp: boolean;
  templateColumns: string;
}

export const EvmTransactionsTableRow = ({
  assetInfos,
  evmDenom,
  evmTransaction,
  showTimestamp,
  templateColumns,
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
      onClick={() => onRowSelect(formatEvmTxHash(evmTransaction.tx.hash))}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow />
      <TableRow pr={1}>
        <ExplorerLink
          type="evm_tx_hash"
          value={formatEvmTxHash(evmTransaction.tx.hash)}
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
        <EvmMethodChip txInput={evmTransaction.tx.input} />
      </TableRow>
      <TableRow>
        <ExplorerLink
          type="user_address"
          value={evmTransaction.tx.from}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <CustomIcon name="arrow-right" boxSize={5} color="gray.600" />
      </TableRow>
      <TableRow>
        <EvmToCell toAddress={toAddress} />
      </TableRow>
      <TableRow
        alignItems="start"
        flexDirection="column"
        justifyContent="center"
      >
        <Text variant="body2">
          <Text as="span" mr={1} fontWeight={700}>
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
          <Text variant="body3" color="text.dark">
            ({formatPrice(token.value)})
          </Text>
        )}
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
