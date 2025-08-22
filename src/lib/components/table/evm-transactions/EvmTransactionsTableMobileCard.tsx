import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  coinToTokenWithValue,
  dateFromNow,
  formatEvmTxHash,
  formatUTC,
  formatUTokenWithPrecision,
  getEvmAmount,
  getTokenLabel,
} from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

interface EvmTransactionsTableMobileCardProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmTransaction: TxDataWithTimeStampJsonRpc;
  showTimestamp: boolean;
}
export const EvmTransactionsTableMobileCard = ({
  assetInfos,
  evmDenom,
  evmTransaction,
  showTimestamp,
}: EvmTransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const { amount, denom } = getEvmAmount(evmTransaction, evmDenom);

  const token = coinToTokenWithValue(denom, amount, assetInfos);
  return (
    <MobileCardTemplate
      bottomContent={
        <Stack gap={3}>
          <Grid gap={3} gridTemplateColumns="1fr 1fr">
            <Stack gap={0}>
              <MobileLabel label="Amount" variant="body3" />
              <Text variant="body2">
                {formatUTokenWithPrecision(
                  token.amount,
                  token.precision ?? 0,
                  true,
                  token.precision ? 6 : 0
                )}{" "}
                {getTokenLabel(token.denom, token.symbol)}
              </Text>
            </Stack>
            <Stack gap={0}>
              <MobileLabel label="Sender" variant="body3" />
              <ExplorerLink
                marginLeft={-1}
                showCopyOnHover
                type="user_address"
                value={evmTransaction.tx.from}
              />
            </Stack>
          </Grid>
          {showTimestamp && (
            <Flex direction="column">
              <Text color="text.dark" variant="body2">
                {formatUTC(evmTransaction.timestamp)}
              </Text>
              <Text color="text.disabled" variant="body3">
                ({dateFromNow(evmTransaction.timestamp)})
              </Text>
            </Flex>
          )}
        </Stack>
      }
      middleContent={<Text>Add decode txs here...</Text>}
      topContent={
        <Flex alignItems="center" gap={1}>
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
            type="tx_hash"
            value={formatEvmTxHash(evmTransaction.tx.hash)}
          />
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/evm-txs/[txHash]",
          query: { txHash: formatEvmTxHash(evmTransaction.tx.hash) },
        })
      }
    />
  );
};
