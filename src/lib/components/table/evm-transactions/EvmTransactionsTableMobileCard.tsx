import { Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
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

interface EvmTransactionsTableMobileCardProps {
  evmTransaction: TxDataWithTimeStampJsonRpc;
  evmDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  showTimestamp: boolean;
}
export const EvmTransactionsTableMobileCard = ({
  evmTransaction,
  evmDenom,
  assetInfos,
  showTimestamp,
}: EvmTransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const toAddress = getEvmToAddress(evmTransaction);
  const { amount, denom } = getEvmAmount(evmTransaction, evmDenom);

  const token = coinToTokenWithValue(denom, amount, assetInfos);
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/evm-txs/[txHash]",
          query: { txHash: formatEvmTxHash(evmTransaction.tx.hash) },
        })
      }
      topContent={
        <Flex align="center" gap={2} w="full">
          <Flex direction="column" flex={3} gap={1}>
            <MobileLabel label="Transaction Hash" />
            <Flex gap={1} alignItems="center">
              {evmTransaction.txReceipt.status ? (
                <CustomIcon name="check" color="success.main" />
              ) : (
                <CustomIcon name="close" color="error.main" />
              )}
              <ExplorerLink
                value={formatEvmTxHash(evmTransaction.tx.hash)}
                type="tx_hash"
                showCopyOnHover
              />
            </Flex>
          </Flex>
          <Flex direction="column" flex={2} gap={1}>
            <MobileLabel label="Method" />
            <EvmMethodChip txInput={evmTransaction.tx.input} />
          </Flex>
        </Flex>
      }
      middleContent={
        <>
          <Flex>
            <Flex direction="column" flex={1} gap={1}>
              <MobileLabel label="sender" />
              <ExplorerLink
                value={evmTransaction.tx.from}
                type="user_address"
                showCopyOnHover
              />
            </Flex>
            <Flex direction="column" flex={1} gap={1}>
              <MobileLabel label="To" />
              <EvmToCell toAddress={toAddress} />
            </Flex>
          </Flex>
          <Flex direction="column" mt={3}>
            <MobileLabel label="Amount" />
            <Flex gap={2} align="center">
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
              <Text variant="body3" color="text.dark">
                {!isUndefined(token.value)
                  ? `(${formatPrice(token.value)})`
                  : "N/A"}
              </Text>
            </Flex>
          </Flex>
        </>
      }
      bottomContent={
        showTimestamp && (
          <Flex direction="column">
            <Text variant="body2" color="text.dark">
              {formatUTC(evmTransaction.timestamp)}
            </Text>
            <Text variant="body3" color="text.disabled">
              ({dateFromNow(evmTransaction.timestamp)})
            </Text>
          </Flex>
        )
      }
    />
  );
};
