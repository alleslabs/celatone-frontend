import { Badge, Box, Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";

import { AccordionTx } from "../AccordionTx";
import { TableRow } from "../tableComponents";
import { ActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { Transaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { FurtherActionButton } from "./FurtherActionButton";
import { RelationChip } from "./RelationChip";

interface TransactionsTableRowProps {
  showAction: boolean;
  showRelations: boolean;
  showSuccess: boolean;
  showTimestamp: boolean;
  templateColumns: string;
  transaction: Transaction;
}

export const TransactionsTableRow = ({
  showAction,
  showRelations,
  showSuccess,
  showTimestamp,
  templateColumns,
  transaction,
}: TransactionsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const isAccordion = transaction.messages.length > 1;
  return (
    <Box minW="min-content" w="full">
      <Grid
        className="copier-wrapper"
        _hover={{ background: "gray.900" }}
        cursor={isAccordion ? "pointer" : "default"}
        onClick={isAccordion ? onToggle : undefined}
        templateColumns={templateColumns}
        transition="all 0.25s ease-in-out"
      >
        <TableRow pl={2}>
          {isAccordion && (
            <CustomIcon
              name="chevron-down"
              color="gray.600"
              transform={isOpen ? "rotate(0)" : "rotate(-90deg)"}
              transition="all 0.25s ease-in-out"
            />
          )}
        </TableRow>
        <TableRow pr={1}>
          <>
            <ExplorerLink
              type="tx_hash"
              value={transaction.hash.toLocaleUpperCase()}
              showCopyOnHover
            />
            {transaction.messages.length > 1 && (
              <Badge ml={2} variant="primary-light">
                {transaction.messages.length}
              </Badge>
            )}
          </>
        </TableRow>
        {showSuccess && (
          <TableRow>
            {transaction.success ? (
              <CustomIcon name="check" color="success.main" />
            ) : (
              <CustomIcon name="close" color="error.main" />
            )}
          </TableRow>
        )}
        <TableRow>
          <ActionMessages transaction={transaction} />
        </TableRow>
        {showRelations && (
          <TableRow>
            <RelationChip isSigner={transaction.isSigner} />
          </TableRow>
        )}
        <TableRow>
          <ExplorerLink
            type="user_address"
            value={transaction.sender}
            showCopyOnHover
          />
        </TableRow>
        {showTimestamp && (
          <>
            {transaction.created ? (
              <TableRow>
                <Flex gap={1} direction="column">
                  <Text variant="body3">{formatUTC(transaction.created)}</Text>
                  <Text variant="body3" color="text.dark">
                    {`(${dateFromNow(transaction.created)})`}
                  </Text>
                </Flex>
              </TableRow>
            ) : (
              <TableRow>N/A</TableRow>
            )}
          </>
        )}
        {showAction && (
          <TableRow>
            <FurtherActionButton transaction={transaction} />
          </TableRow>
        )}
      </Grid>
      {isAccordion && (
        <Grid hidden={!isOpen} py={4} w="full">
          {transaction.messages.map((msg, index) => (
            <AccordionTx
              key={index.toString() + msg.type}
              isSigner={transaction.isSigner}
              message={msg}
              msgIndex={index}
              txHash={transaction.hash}
              allowFurtherAction={showAction}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
