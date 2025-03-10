import { Badge, Box, Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";

import { ActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { Transaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { FurtherActionButton } from "./FurtherActionButton";
import { RelationChip } from "./RelationChip";
import { AccordionTx } from "../AccordionTx";
import { TableRow } from "../tableComponents";

interface TransactionsTableRowProps {
  transaction: Transaction;
  templateColumns: string;
  showSuccess: boolean;
  showRelations: boolean;
  showTimestamp: boolean;
  showAction: boolean;
}

export const TransactionsTableRow = ({
  transaction,
  templateColumns,
  showSuccess,
  showRelations,
  showTimestamp,
  showAction,
}: TransactionsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const isAccordion = transaction.messages.length > 1;
  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        onClick={isAccordion ? onToggle : undefined}
        _hover={{ background: "gray.900" }}
        transition="all 0.25s ease-in-out"
        cursor={isAccordion ? "pointer" : "default"}
      >
        <TableRow pl={2}>
          {isAccordion && (
            <CustomIcon
              name="chevron-down"
              transform={isOpen ? "rotate(0)" : "rotate(-90deg)"}
              transition="all 0.25s ease-in-out"
              color="gray.600"
            />
          )}
        </TableRow>
        <TableRow pr={1}>
          <>
            <ExplorerLink
              value={transaction.hash.toLocaleUpperCase()}
              type="tx_hash"
              showCopyOnHover
            />
            {transaction.messages.length > 1 && (
              <Badge variant="primary-light" ml={2}>
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
            value={transaction.sender}
            type="user_address"
            showCopyOnHover
          />
        </TableRow>
        {showTimestamp && (
          <>
            {transaction.created ? (
              <TableRow>
                <Flex direction="column" gap={1}>
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
        <Grid w="full" py={4} hidden={!isOpen}>
          {transaction.messages.map((msg, index) => (
            <AccordionTx
              isSigner={transaction.isSigner}
              key={index.toString() + msg.type}
              message={msg}
              txHash={transaction.hash}
              msgIndex={index}
              allowFurtherAction={showAction}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
