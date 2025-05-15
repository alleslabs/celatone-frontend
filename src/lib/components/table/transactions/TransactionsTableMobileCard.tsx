import type { Transaction } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { dateFromNow, formatUTC } from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { RelationChip } from "./RelationChip";

interface TransactionsTableMobileCardProps {
  showRelations: boolean;
  showSuccess: boolean;
  showTimestamp: boolean;
  transaction: Transaction;
}
export const TransactionsTableMobileCard = ({
  showRelations,
  showSuccess,
  showTimestamp,
  transaction,
}: TransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const isTxHasNoData = transaction.height === 0;

  return (
    <MobileCardTemplate
      bottomContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="sender" />
            {isTxHasNoData ? (
              <Text color="gray.600">N/A</Text>
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
          <Text color="gray.600">
            Unable to load data due to large transaction size
          </Text>
        ) : (
          <ActionMessages transaction={transaction} />
        )
      }
      topContent={
        <>
          <Flex align="center" gap={2}>
            {showSuccess && !isTxHasNoData && (
              <>
                {transaction.success ? (
                  <CustomIcon color="success.main" name="check" />
                ) : (
                  <CustomIcon color="error.main" name="close" />
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
