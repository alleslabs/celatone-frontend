import { Flex, Grid, useDisclosure, Tag, Box } from "@chakra-ui/react";

import { useGetAddressType } from "lib/app-provider";
import { RenderActionMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { AccordionTx, TableRow } from "lib/components/table";
import type { BlockTransaction } from "lib/types";

interface BlockTxTableRowProps {
  transaction: BlockTransaction;
  templateColumns: string;
}

export const BlockTxTableRow = ({
  transaction,
  templateColumns,
}: BlockTxTableRowProps) => {
  const getAddressType = useGetAddressType();
  const { isOpen, onToggle } = useDisclosure();
  const isAccordion = transaction.messages.length > 1;
  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        onClick={isAccordion ? onToggle : undefined}
        _hover={{ background: "pebble.900" }}
        transition="all .25s ease-in-out"
        cursor={isAccordion ? "pointer" : "default"}
      >
        <TableRow>
          <ExplorerLink
            value={transaction.hash.toLocaleUpperCase()}
            type="tx_hash"
            showCopyOnHover
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
            <RenderActionMessages transaction={transaction} />
            {transaction.isIbc && (
              <Tag variant="honeydewDark" size="sm">
                IBC
              </Tag>
            )}
          </Flex>
        </TableRow>

        <TableRow>
          <ExplorerLink
            value={transaction.sender}
            type={getAddressType(transaction.sender)}
            showCopyOnHover
          />
        </TableRow>

        <TableRow>
          {isAccordion && (
            <CustomIcon
              name={isOpen ? "chevron-up" : "chevron-down"}
              color="pebble.600"
            />
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
              accordionSpacing="211px"
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
