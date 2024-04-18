import { Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { ActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { Transaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { RelationChip } from "./RelationChip";

interface TransactionsTableMobileCardProps {
  transaction: Transaction;
  showRelations: boolean;
  showTimestamp: boolean;
}
export const TransactionsTableMobileCard = ({
  transaction,
  showRelations,
  showTimestamp,
}: TransactionsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: transaction.hash.toLocaleUpperCase() },
        })
      }
      topContent={
        <>
          <Flex align="center" gap={2}>
            {transaction.success ? (
              <CustomIcon name="check" color="success.main" />
            ) : (
              <CustomIcon name="close" color="error.main" />
            )}
            <ExplorerLink
              value={transaction.hash.toLocaleUpperCase()}
              type="tx_hash"
              showCopyOnHover
            />
          </Flex>
          {showRelations && <RelationChip isSigner={transaction.isSigner} />}
        </>
      }
      middleContent={<ActionMessages transaction={transaction} />}
      bottomContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="sender" />
            <ExplorerLink
              value={transaction.sender}
              type="user_address"
              showCopyOnHover
            />
          </Flex>
          {showTimestamp && (
            <Flex direction="column">
              <Text variant="body3">{formatUTC(transaction.created)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(transaction.created)})`}
              </Text>
            </Flex>
          )}
        </Flex>
      }
    />
  );
};
