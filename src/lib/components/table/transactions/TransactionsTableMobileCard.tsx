import type { TransactionWithTxResponse } from "lib/types";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ActionMessages } from "lib/components/action-msg/ActionMessages";
import { DecodeMessage } from "lib/components/decode-message";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useTxDecoder } from "lib/services/tx";
import { dateFromNow, formatUTC } from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { RelationChip } from "./RelationChip";

interface TransactionsTableMobileCardProps {
  showRelations: boolean;
  showSuccess: boolean;
  showTimestamp: boolean;
  transaction: TransactionWithTxResponse;
}
export const TransactionsTableMobileCard = ({
  showRelations,
  showSuccess,
  showTimestamp,
  transaction,
}: TransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const isTxHasNoData = transaction.height === 0;
  const { rawTxResponse, txResponse } = transaction;
  const { data: decodedTx, isFetching: isDecodedTxFetching } =
    useTxDecoder(rawTxResponse);

  return (
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
          <>
            {isDecodedTxFetching ? (
              <Spinner boxSize={4} />
            ) : (
              <>
                {txResponse && decodedTx ? (
                  <DecodeMessage
                    compact
                    decodedMessage={decodedTx.messages[0].decodedMessage}
                    log={undefined}
                    metadata={decodedTx.metadata}
                    msgBody={txResponse.tx.body.messages[0]}
                    msgCount={txResponse.tx.body.messages.length}
                  />
                ) : (
                  <ActionMessages transaction={transaction} />
                )}
              </>
            )}
          </>
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
  );
};
