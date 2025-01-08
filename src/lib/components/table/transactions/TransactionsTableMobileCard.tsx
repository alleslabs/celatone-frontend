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
  return (
    <MobileCardTemplate
      middleContent={<ActionMessages transaction={transaction} />}
      bottomContent={
        <Flex gap={3} direction="column">
          <Flex direction="column">
            <MobileLabel label="sender" />
            <ExplorerLink
              type="user_address"
              value={transaction.sender}
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
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: transaction.hash.toLocaleUpperCase() },
        })
      }
      topContent={
        <>
          <Flex align="center" gap={2}>
            {showSuccess && (
              <>
                {transaction.success ? (
                  <CustomIcon name="check" color="success.main" />
                ) : (
                  <CustomIcon name="close" color="error.main" />
                )}
              </>
            )}
            <ExplorerLink
              type="tx_hash"
              value={transaction.hash.toLocaleUpperCase()}
              showCopyOnHover
            />
          </Flex>
          {showRelations && <RelationChip isSigner={transaction.isSigner} />}
        </>
      }
    />
  );
};
