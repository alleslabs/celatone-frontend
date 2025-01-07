import { Flex, Stack, Text } from "@chakra-ui/react";
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
  const toAddress = getEvmToAddress(evmTransaction);
  const { amount, denom } = getEvmAmount(evmTransaction, evmDenom);

  const token = coinToTokenWithValue(denom, amount, assetInfos);
  return (
    <MobileCardTemplate
      middleContent={
        <Stack gap={3}>
          <Flex gap={1} direction="column">
            <MobileLabel label="sender" variant="body2" />
            <ExplorerLink
              type="user_address"
              value={evmTransaction.tx.from}
              showCopyOnHover
            />
          </Flex>
          <Flex gap={1} direction="column">
            <MobileLabel label="To" variant="body2" />
            <EvmToCell toAddress={toAddress} />
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Amount" variant="body2" />
            <Flex align="center" gap={2}>
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
            </Flex>
          </Flex>
        </Stack>
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
      onClick={() =>
        navigate({
          pathname: "/evm-txs/[txHash]",
          query: { txHash: formatEvmTxHash(evmTransaction.tx.hash) },
        })
      }
      topContent={
        <Flex align="center" gap={2} w="full">
          <Flex flex={3} gap={1} direction="column">
            <MobileLabel label="Transaction Hash" />
            <Flex alignItems="center" gap={1}>
              {evmTransaction.txReceipt.status ? (
                <CustomIcon name="check" color="success.main" />
              ) : (
                <CustomIcon name="close" color="error.main" />
              )}
              <ExplorerLink
                type="tx_hash"
                value={formatEvmTxHash(evmTransaction.tx.hash)}
                showCopyOnHover
              />
            </Flex>
          </Flex>
          <Flex flex={2} gap={1} direction="column">
            <MobileLabel label="Method" />
            <EvmMethodChip txInput={evmTransaction.tx.input} />
          </Flex>
        </Flex>
      }
    />
  );
};
