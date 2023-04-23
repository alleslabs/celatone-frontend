import { Flex, Text, Grid, useDisclosure, Box, Badge } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TableRow } from "lib/components/table";
import type { Addr, Message } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { PoolTxsAction, PoolTxsDetail } from "./messages";

interface PoolTxsTableRowProps {
  txHash?: string;
  msgCount: number;
  message: Message;
  sender: Addr;
  created?: Date;
  templateColumns: string;
}

export const PoolTxsTableRow = ({
  txHash,
  msgCount,
  message,
  sender,
  created,
  templateColumns,
}: PoolTxsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        onClick={onToggle}
        _hover={{ background: "pebble.900" }}
        transition="all .25s ease-in-out"
        cursor="pointer"
      >
        <TableRow>
          {txHash && (
            <Flex>
              <ExplorerLink
                value={txHash.toLocaleUpperCase()}
                type="tx_hash"
                showCopyOnHover
              />
              {msgCount > 1 && (
                <Badge variant="lilac" ml="6px">
                  {msgCount}
                </Badge>
              )}
            </Flex>
          )}
        </TableRow>
        <TableRow>
          <PoolTxsAction msg={message} />
        </TableRow>

        <TableRow>
          <ExplorerLink value={sender} type="user_address" showCopyOnHover />
        </TableRow>

        <TableRow>
          {created && (
            <Flex direction="column" gap={1}>
              <Text variant="body3">{formatUTC(created)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(created)})`}
              </Text>
            </Flex>
          )}
        </TableRow>

        <TableRow>
          <CustomIcon name={isOpen ? "chevron-up" : "chevron-down"} />
        </TableRow>
      </Grid>
      <Grid w="full" py={4} hidden={!isOpen}>
        <PoolTxsDetail msg={message} />
      </Grid>
    </Box>
  );
};
