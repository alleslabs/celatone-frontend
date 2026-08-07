import type { TransactionWithTxResponse } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useTxDecoder } from "lib/services/tx";
import { dateFromNow, formatUTC } from "lib/utils";
import { memo } from "react";
import { useInView } from "react-intersection-observer";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { RelationChip } from "./RelationChip";
import { TransactionsTableDecodeMessageColumn } from "./TransactionsTableDecodeMessageColumn";

interface TransactionsTableMobileCardProps {
  showRelations: boolean;
  showSuccess: boolean;
  showTimestamp: boolean;
  transaction: TransactionWithTxResponse;
}
const TransactionsTableMobileCardComponent = ({
  showRelations,
  showSuccess,
  showTimestamp,
  transaction,
}: TransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const { inView, ref } = useInView({ triggerOnce: true });
  const isTxHasNoData = transaction.height === 0;
  const { rawTxResponse, txResponse } = transaction;
  const { data: decodedTx, isFetching: isDecodedTxFetching } = useTxDecoder(
    rawTxResponse,
    { defer: true, enabled: inView }
  );

  return (
    <Box
      style={{
        containIntrinsicSize: "auto 160px",
        contentVisibility: "auto",
      }}
      w="full"
      ref={ref}
    >
      <MobileCardTemplate
        bottomContent={
          <Flex direction="column" gap={3}>
            <Flex direction="column">
              <MobileLabel label="sender" />
              {isTxHasNoData ? (
                <Text color="gray.600" variant="body2">
                  N/A
                </Text>
              ) : (
                <ExplorerLink
                  showCopyOnHover
                  type="user_address"
                  value={transaction.sender}
                />
              )}
            </Flex>
            {showTimestamp && !isTxHasNoData && (
              <Flex direction="column">
                <Text variant="body3">{formatUTC(transaction.created)}</Text>
                <Text color="text.dark" variant="body3">
                  {`(${dateFromNow(transaction.created)})`}
                </Text>
              </Flex>
            )}
          </Flex>
        }
        middleContent={
          isTxHasNoData ? (
            <Text color="gray.600" variant="body2">
              Unable to load data due to large transaction size
            </Text>
          ) : (
            <TransactionsTableDecodeMessageColumn
              decodedTx={decodedTx}
              isDecodedTxFetching={isDecodedTxFetching}
              transaction={transaction}
              txResponse={txResponse}
            />
          )
        }
        topContent={
          <>
            <Flex align="center" gap={2}>
              {showSuccess && !isTxHasNoData && (
                <>
                  {transaction.success ? (
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
                </>
              )}
              <ExplorerLink
                showCopyOnHover
                type="tx_hash"
                value={transaction.hash.toLocaleUpperCase()}
              />
            </Flex>
            {showRelations && !isTxHasNoData && (
              <RelationChip isSigner={transaction.isSigner} />
            )}
          </>
        }
        onClick={() =>
          navigate({
            pathname: "/txs/[txHash]",
            query: { txHash: transaction.hash.toLocaleUpperCase() },
          })
        }
      />
    </Box>
  );
};

export const TransactionsTableMobileCard = memo(
  TransactionsTableMobileCardComponent
);
