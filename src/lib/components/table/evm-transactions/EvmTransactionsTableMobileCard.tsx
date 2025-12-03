import type { EvmTxResponseSequencerWithRpcData } from "lib/services/types";
import type { AssetInfos, HexAddr20, Option } from "lib/types";

import { Flex, Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { DecodeCosmosEvmMessageHeader } from "lib/components/decode-message/evm-message";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
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

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

interface EvmTransactionsTableMobileCardProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmTransaction: EvmTxResponseSequencerWithRpcData;
  showTimestamp: boolean;
}
export const EvmTransactionsTableMobileCard = ({
  assetInfos,
  evmDenom,
  evmTransaction,
  showTimestamp,
}: EvmTransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const { rawTx, rawTxReceipt } = evmTransaction;
  const { data: decodedTx } = useEvmTxDecoder({
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

  const token = coinToTokenWithValue(denom, amount, assetInfos);
  return (
    <MobileCardTemplate
      bottomContent={
        <Stack gap={3}>
          <Grid gap={3} templateColumns="1fr 1fr">
            <GridItem>
              <Flex direction="column">
                <MobileLabel label="Amount" variant="body2" />
                <Flex align="center" gap={2}>
                  <Text variant="body2">
                    {formatUTokenWithPrecision({
                      amount: token.amount,
                      decimalPoints: token.precision ? 6 : 0,
                      isSuffix: true,
                      precision: token.precision ?? 0,
                    })}{" "}
                    {getTokenLabel(token.denom, token.symbol)}
                  </Text>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex direction="column" gap={1}>
                <MobileLabel label="sender" variant="body2" />
                <ExplorerLink
                  showCopyOnHover
                  type="user_address"
                  value={evmTransaction.from}
                />
              </Flex>
            </GridItem>
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
      middleContent={
        decodedTx ? (
          <DecodeCosmosEvmMessageHeader
            compact
            evmDecodedMessage={decodedTx}
            evmVerifyInfos={evmVerifyInfos}
            log={undefined}
            msgCount={1}
          />
        ) : (
          <EvmMethodChip
            txInput={evmTransaction.input}
            txTo={evmTransaction.to}
          />
        )
      }
      topContent={
        <Flex align="center" gap={0.5} w="full">
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
            type="tx_hash"
            value={formatEvmTxHash(evmTransaction.transactionHash)}
          />
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/evm-txs/[txHash]",
          query: { txHash: formatEvmTxHash(evmTransaction.transactionHash) },
        })
      }
    />
  );
};
