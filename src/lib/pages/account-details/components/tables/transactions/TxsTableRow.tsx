import {
  Box,
  Flex,
  Grid,
  Icon,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdCheck, MdClose, MdKeyboardArrowDown } from "react-icons/md";

import { RenderActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { AccordionTx } from "lib/components/table/AccordionTx";
import type { PastTransaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxsTableRowProps {
  transaction: PastTransaction;
  templateColumnsStyle: string;
}

export const TxsTableRow = ({
  transaction,
  templateColumnsStyle,
}: TxsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const isAccordion = transaction.messages.length > 1;
  const [showCopyButton, setShowCopyButton] = useState(false);

  return (
    <Box w="full" minW="min-content">
      <Grid
        templateColumns={templateColumnsStyle}
        onClick={isAccordion ? onToggle : undefined}
        _hover={{ background: "pebble.900" }}
        onMouseEnter={() => setShowCopyButton(true)}
        onMouseLeave={() => setShowCopyButton(false)}
        transition="all .25s ease-in-out"
        cursor={isAccordion ? "pointer" : "default"}
      >
        <TableRow pl="16px">
          <ExplorerLink
            value={transaction.hash.toUpperCase()}
            type="tx_hash"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          <Icon
            as={transaction.success ? MdCheck : MdClose}
            fontSize="24px"
            color={transaction.success ? "success.main" : "error.main"}
          />
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
        <TableRow>
          <Flex direction="column" gap={1}>
            {transaction.created ? (
              <Box>
                <Text variant="body3">{formatUTC(transaction.created)}</Text>
                <Text variant="body3" color="text.dark">
                  {`(${dateFromNow(transaction.created)})`}
                </Text>
              </Box>
            ) : (
              <Text variant="body3">N/A</Text>
            )}
          </Flex>
        </TableRow>
        <TableRow>
          {isAccordion && (
            <Icon
              as={MdKeyboardArrowDown}
              transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
              boxSize="24px"
              color="pebble.600"
            />
          )}
        </TableRow>
      </Grid>
      {isAccordion && (
        <Grid w="full" py={2} bg="pebble.900" hidden={!isOpen}>
          {transaction.messages.map((msg, index) => (
            <AccordionTx
              key={index.toString() + msg.type}
              allowFurtherAction={false}
              message={msg}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
