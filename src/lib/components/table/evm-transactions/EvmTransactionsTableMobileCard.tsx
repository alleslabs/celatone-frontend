import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Flex, Stack, Text } from "@chakra-ui/react";
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

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

interface EvmTransactionsTableMobileCardProps {
  evmTransaction: TxDataWithTimeStampJsonRpc;
  evmDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  showTimestamp: boolean;
}
export const EvmTransactionsTableMobileCard = ({
  assetInfos,
  evmDenom,
  evmTransaction,
  showTimestamp,
}: EvmTransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const toAddress = getEvmToAddress(evmTransaction);
  const { amount, denom } = getEvmAmount(evmTransaction, evmDenom);

  const token = coinToTokenWithValue(denom, amount, assetInfos);
  return (
    <MobileCardTemplate
      bottomContent={
        showTimestamp && (
          <Flex direction="column">
            <Text color="text.dark" variant="body2">
              {formatUTC(evmTransaction.timestamp)}
            </Text>
            <Text color="text.disabled" variant="body3">
              ({dateFromNow(evmTransaction.timestamp)})
            </Text>
          </Flex>
        )
      }
      middleContent={
        <Stack gap={3}>
          <Flex direction="column" gap={1}>
            <MobileLabel label="sender" variant="body2" />
            <ExplorerLink
              showCopyOnHover
              type="user_address"
              value={evmTransaction.tx.from}
            />
          </Flex>
          <Flex direction="column" gap={1}>
            <MobileLabel label="To" variant="body2" />
            <EvmToCell toAddress={toAddress} />
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Amount" variant="body2" />
            <Flex align="center" gap={2}>
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
            </Flex>
          </Flex>
        </Stack>
      }
      topContent={
        <Flex align="center" gap={2} w="full">
          <Flex direction="column" flex={3} gap={1}>
            <MobileLabel label="Transaction hash" />
            <Flex alignItems="center" gap={1}>
              {evmTransaction.txReceipt.status ? (
                <CustomIcon color="success.main" name="check" />
              ) : (
                <CustomIcon color="error.main" name="close" />
              )}
              <ExplorerLink
                showCopyOnHover
                type="tx_hash"
                value={formatEvmTxHash(evmTransaction.tx.hash)}
              />
            </Flex>
          </Flex>
          <Flex direction="column" flex={2} gap={1}>
            <MobileLabel label="Method" />
            <EvmMethodChip
              txInput={evmTransaction.tx.input}
              txTo={evmTransaction.tx.to}
            />
          </Flex>
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
