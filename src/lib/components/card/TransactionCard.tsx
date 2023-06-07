import { Flex, Tag, Text } from "@chakra-ui/react";

import { RenderActionMessages } from "../action-msg/ActionMessages";
import { ExplorerLink } from "../ExplorerLink";
import { CustomIcon } from "../icon";
import { RelationChip } from "../table/transactions/RelationChip";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { Transaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface TransactionCardProps {
  transaction: Transaction;
  showRelations?: boolean;
}
export const TransactionCard = ({
  transaction,
  showRelations = true,
}: TransactionCardProps) => {
  return (
    <DefaultMobileCard
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
      middleContent={
        <Flex>
          <RenderActionMessages transaction={transaction} />
          {transaction.isIbc && (
            <Tag variant="accent-dark" size="sm" w={8} justifyContent="center">
              IBC
            </Tag>
          )}
        </Flex>
      }
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
          <Flex direction="column">
            <Text variant="body3">{formatUTC(transaction.created)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(transaction.created)})`}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
