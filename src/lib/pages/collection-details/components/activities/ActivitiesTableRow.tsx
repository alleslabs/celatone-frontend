import { Grid, Box, Text, Flex, Badge } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { Message } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

interface ActivitiesTableRowProps {
  hash: string;
  timestamp: string;
  templateColumns: string;
  messages: Message[];
}

export const ActivitiesTableRow = ({
  hash,
  timestamp,
  templateColumns,
  messages,
}: ActivitiesTableRowProps) => {
  const formatHash = hash.replace("\\x", "");
  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        _hover={{ background: "gray.900" }}
        transition="all 0.25s ease-in-out"
      >
        <TableRow pr={1}>
          <ExplorerLink
            value={formatHash.toLocaleUpperCase()}
            type="tx_hash"
            showCopyOnHover
          />
        </TableRow>
        <TableRow>
          <Flex gap="8px">
            <Text>Message</Text>
            <Flex gap="4px">
              {messages.map((msg) => {
                const { type } = msg;
                return (
                  <Badge key={type} textTransform="capitalize">
                    {extractMsgType(type).replace("Msg", "")}
                  </Badge>
                );
              })}
            </Flex>
          </Flex>
        </TableRow>
        <TableRow>
          <Box>
            <Text>{formatUTC(new Date(timestamp))}</Text>
            <Text>{dateFromNow(new Date(timestamp))}</Text>
          </Box>
        </TableRow>
      </Grid>
    </Box>
  );
};
