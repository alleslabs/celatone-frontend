import type { MutateEvent } from "lib/types";

import { Badge, Box, Flex, Grid, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { dateFromNow, formatUTC } from "lib/utils";

import { RemarkRender } from "../RemarkRender";
import { TableRow } from "../tableComponents";

interface MutateEventsTableRowProps extends MutateEvent {
  templateColumns: string;
}

export const MutateEventsTableRow = ({
  timestamp,
  templateColumns,
  mutatedFieldName,
  oldValue,
  newValue,
  remark,
}: MutateEventsTableRowProps) => (
  <Box minW="min-content" w="full">
    <Grid
      className="copier-wrapper"
      _hover={{ background: "gray.900" }}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow pr={1}>
        <Badge>{mutatedFieldName}</Badge>
      </TableRow>
      <TableRow>
        <Text display="inline" wordBreak="break-word">
          {oldValue}
        </Text>
      </TableRow>
      <TableRow px={10}>
        <CustomIcon color="gray.600" name="arrow-right" />
      </TableRow>
      <TableRow>
        <Text display="inline" wordBreak="break-word">
          {newValue}
        </Text>
      </TableRow>
      <TableRow>
        <Flex direction="column" gap={1}>
          <Text variant="body3">{formatUTC(timestamp)}</Text>
          <Text color="text.dark" variant="body3">
            {`(${dateFromNow(timestamp)})`}
          </Text>
        </Flex>
      </TableRow>
      <TableRow>
        <RemarkRender {...remark} />
      </TableRow>
    </Grid>
  </Box>
);
