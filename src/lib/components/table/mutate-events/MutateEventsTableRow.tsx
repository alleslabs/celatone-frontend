import { Badge, Box, Flex, Grid, Text } from "@chakra-ui/react";

import { RemarkRender } from "../RemarkRender";
import { TableRow } from "../tableComponents";
import { CustomIcon } from "lib/components/icon";
import type { MutateEvent } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface MutateEventsTableRowProps extends MutateEvent {
  templateColumns: string;
}

export const MutateEventsTableRow = ({
  mutatedFieldName,
  newValue,
  oldValue,
  remark,
  templateColumns,
  timestamp,
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
        <CustomIcon name="arrow-right" color="gray.600" />
      </TableRow>
      <TableRow>
        <Text display="inline" wordBreak="break-word">
          {newValue}
        </Text>
      </TableRow>
      <TableRow>
        <Flex gap={1} direction="column">
          <Text variant="body3">{formatUTC(timestamp)}</Text>
          <Text variant="body3" color="text.dark">
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
