import type { EvmTxResponseSequencerWithRpcData } from "lib/services/types";
import type { AssetInfos, HexAddr20, Option } from "lib/types";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useEvmTxDecoder } from "lib/services/tx";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import {
  coinToTokenWithValue,
  dateFromNow,
  formatEvmTxHash,
  formatUTC,
  formatUTokenWithPrecision,
  getEvmAmount,
  getTokenLabel,
} from "lib/utils";

import { TableRow } from "../tableComponents";
import { EvmTransactionsTableDecodeMessageColumn } from "./EvmTransactionsTableDecodeMessageColumn";

interface EvmTransactionsTableRowProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmTransaction: EvmTxResponseSequencerWithRpcData;
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
  const { rawTx, rawTxReceipt } = evmTransaction;
  const { data: decodedTx, isFetching: isDecodedTxFetching } = useEvmTxDecoder({
    tx: rawTx,
    txReceipt: rawTxReceipt,
  });
  const { data: evmVerifyInfos } = useEvmVerifyInfos(
    evmTransaction.to
      ? [evmTransaction.to].filter((addr): addr is HexAddr20 => addr !== null)
      : []
  );
  const { amount, denom } = getEvmAmount({
    evmDenom,
    input: evmTransaction.input,
    to: evmTransaction.to,
    value: evmTransaction.value,
  });

  const onRowSelect = (txHash: string) =>
    navigate({
      pathname: "/evm-txs/[txHash]",
      query: { txHash },
    });

  const token = coinToTokenWithValue(denom, amount, assetInfos);

  return (
    <Box minW="min-content" w="full">
      <Grid
        className="copier-wrapper"
        _hover={{ bg: "gray.900" }}
        cursor="pointer"
        templateColumns={templateColumns}
        transition="all 0.25s ease-in-out"
        onClick={() =>
          onRowSelect(formatEvmTxHash(evmTransaction.transactionHash))
        }
      >
        <TableRow gap={1} pr={1}>
          {evmTransaction.status === "0x1" ? (
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
            value={formatEvmTxHash(evmTransaction.transactionHash)}
          />
        </TableRow>
        <TableRow maxW="100%">
          <EvmTransactionsTableDecodeMessageColumn
            decodedTx={decodedTx}
            evmVerifyInfos={evmVerifyInfos}
            isDecodedTxFetching={isDecodedTxFetching}
            txInput={evmTransaction.input}
            txTo={evmTransaction.to}
          />
        </TableRow>
        <TableRow>
          <ExplorerLink
            showCopyOnHover
            type="user_address"
            value={evmTransaction.from}
          />
        </TableRow>
        <TableRow
          alignItems="start"
          flexDirection="column"
          justifyContent="center"
        >
          <Text color="text.dark" isTruncated maxW="100%" variant="body2">
            {formatUTokenWithPrecision({
              amount: token.amount,
              decimalPoints: token.precision ? 6 : 0,
              isSuffix: true,
              precision: token.precision ?? 0,
            })}{" "}
            {getTokenLabel(token.denom, token.symbol)}
          </Text>
        </TableRow>
        {showTimestamp && (
          <TableRow>
            <Flex direction="column" gap={1}>
              <Text variant="body3">{formatUTC(evmTransaction.timestamp)}</Text>
              <Text color="text.dark" variant="body3">
                {`(${dateFromNow(evmTransaction.timestamp)})`}
              </Text>
            </Flex>
          </TableRow>
        )}
      </Grid>
    </Box>
  );
};
