import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  coinToTokenWithValue,
  formatEvmTxHash,
  formatUTokenWithPrecision,
  getEvmAmount,
} from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

interface EvmTransactionsTableMobileCardProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmTransaction: TxDataWithTimeStampJsonRpc;
}
export const EvmTransactionsTableMobileCard = ({
  assetInfos,
  evmDenom,
  evmTransaction,
}: EvmTransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const { amount, denom } = getEvmAmount(evmTransaction, evmDenom);

  const token = coinToTokenWithValue(denom, amount, assetInfos);
  return (
    <MobileCardTemplate
      bottomContent={
        <Stack gap={3}>
          {/* TODO: add decoded here */}
          <Grid gap={3} gridTemplateColumns="1fr 1fr">
            <Stack gap={0}>
              <MobileLabel label="Amount" variant="body3" />
              <Flex align="center" gap={2}>
                <Text variant="body2">
                  {formatUTokenWithPrecision({
                    amount: token.amount,
                    precision: token.precision ?? 0,
                  })}{" "}
                  GAS
                </Text>
              </Flex>
            </Stack>
            <Stack gap={0}>
              <MobileLabel label="Sender" variant="body3" />
              <ExplorerLink
                showCopyOnHover
                type="user_address"
                value={evmTransaction.tx.from}
              />
            </Stack>
          </Grid>
        </Stack>
      }
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
