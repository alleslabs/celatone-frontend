import { Flex, Text, Grid, useDisclosure, Tag, Box } from "@chakra-ui/react";
import { useState } from "react";

import { AccordionTx } from "../AccordionTx";
import { TableRow } from "../tableComponents";
import { RenderActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { Transaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface TransactionsTableRowProps {
  transaction: Transaction;
  templateColumns: string;
  showSender: boolean;
}

export const TransactionsTableRow = ({
  transaction,
  templateColumns,
  showSender,
}: TransactionsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const isAccordion = transaction.messages.length > 1;
  const [showCopyButton, setShowCopyButton] = useState(false);

  return (
    <Box w="full" minW="min-content">
      <Grid
        templateColumns={templateColumns}
        onClick={isAccordion ? onToggle : undefined}
        _hover={{ background: "pebble.900" }}
        transition="all .25s ease-in-out"
        cursor={isAccordion ? "pointer" : "default"}
        onMouseEnter={() => setShowCopyButton(true)}
        onMouseLeave={() => setShowCopyButton(false)}
      >
        <TableRow>
          <ExplorerLink
            value={transaction.hash.toLocaleUpperCase()}
            type="tx_hash"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          {transaction.success ? (
            <CustomIcon name="check" color="success.main" />
          ) : (
            <CustomIcon name="close" color="error.main" />
          )}
        </TableRow>
        <TableRow>
          <Flex gap={1} flexWrap="wrap">
            <RenderActionMessages
              transaction={transaction}
              showCopyButton={showCopyButton}
            />
            {transaction.isIbc && (
              <Tag borderRadius="full" bg="honeydew.dark" color="pebble.900">
                IBC
              </Tag>
            )}
          </Flex>
        </TableRow>

        {showSender && (
          <TableRow>
            <ExplorerLink
              value={transaction.sender}
              type="user_address"
              canCopyWithHover
            />
          </TableRow>
        )}

        <TableRow>
          <Flex direction="column" gap={1}>
            {transaction.created ? (
              <>
                <Text variant="body3">{formatUTC(transaction.created)}</Text>
                <Text variant="body3" color="text.dark">
                  {`(${dateFromNow(transaction.created)})`}
                </Text>
              </>
            ) : (
              <Text variant="body3">N/A</Text>
            )}
          </Flex>
        </TableRow>

        <TableRow>
          {isAccordion && (
            <CustomIcon name={isOpen ? "chevron-up" : "chevron-down"} />
          )}
        </TableRow>
      </Grid>
      {isAccordion && (
        <Grid w="full" py={4} hidden={!isOpen}>
          {transaction.messages.map((msg, index) => (
            <AccordionTx
              key={index.toString() + msg.type}
              message={msg}
              allowFurtherAction={false}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
