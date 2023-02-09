import {
  Flex,
  Icon,
  Text,
  Grid,
  useDisclosure,
  Tag,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheck, MdClose, MdKeyboardArrowDown } from "react-icons/md";

import { RenderActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { AccordionTx } from "lib/components/table/AccordionTx";
import type { AllTransaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxsTableRowProps {
  transaction: AllTransaction;
  templateColumnsStyle: string;
}

export const TxsTableRow = ({
  transaction,
  templateColumnsStyle,
}: TxsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const [isAccordion, setIsAccordion] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);

  useEffect(() => {
    if (transaction.messages.length > 1) setIsAccordion(true);
  }, [transaction.messages]);

  return (
    <Box w="full" minW="min-content">
      <Grid
        templateColumns={templateColumnsStyle}
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
          <ExplorerLink
            value={transaction.sender}
            type="user_address"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          <ExplorerLink
            value={transaction.height.toString()}
            type="block_height"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          <Flex direction="row" justify="space-between" align="center" w="full">
            <Flex direction="column" gap={1}>
              <Text variant="body3">{formatUTC(transaction.created)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(transaction.created)})`}
              </Text>
            </Flex>
            {isAccordion && (
              <Icon
                as={MdKeyboardArrowDown}
                transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                boxSize="18px"
              />
            )}
          </Flex>
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
