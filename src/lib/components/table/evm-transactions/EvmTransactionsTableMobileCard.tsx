import { Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";
import {
  coinToTokenWithValue,
  formatEvmTxHash,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface EvmTransactionsTableMobileCardProps {
  evmTransaction: TxDataJsonRpc;
  evmDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
}
export const EvmTransactionsTableMobileCard = ({
  evmTransaction,
  evmDenom,
  assetInfos,
}: EvmTransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();

  const token = coinToTokenWithValue(
    evmDenom ?? "",
    evmTransaction.tx.value.toString(),
    assetInfos
  );
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
          {evmTransaction.txReceipt.status ? (
            <CustomIcon name="check" color="success.main" />
          ) : (
            <CustomIcon name="close" color="error.main" />
          )}
          <Flex direction="column" flex={1}>
            <MobileLabel label="Transaction Hash" />
            <ExplorerLink
              value={formatEvmTxHash(evmTransaction.tx.hash)}
              type="tx_hash"
              showCopyOnHover
            />
          </Flex>
          <Flex direction="column" flex={1}>
            <MobileLabel label="Method" />
            <EvmMethodChip txInput={evmTransaction.tx.input} width="120px" />
          </Flex>
        </Flex>
      }
      middleContent={
        <>
          <Flex>
            <Flex direction="column" flex={1}>
              <MobileLabel label="sender" />
              <ExplorerLink
                value={evmTransaction.tx.from}
                type="user_address"
                showCopyOnHover
              />
            </Flex>
            <Flex direction="column" flex={1}>
              <MobileLabel label="To" />
              {evmTransaction.tx.to ? (
                <ExplorerLink
                  value={evmTransaction.tx.to}
                  type="user_address"
                  showCopyOnHover
                />
              ) : (
                <Text variant="body2" color="text.dark">
                  -
                </Text>
              )}
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
                    true
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
    />
  );
};
