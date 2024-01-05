import { Grid, Box, Text, Badge, Flex } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TableRow } from "lib/components/table";
import type { CollectionMutateEvent } from "lib/services/collection";
import { dateFromNow, formatUTC } from "lib/utils";

const RemarkRender = ({
  remark,
}: {
  remark: { type: string; value: string };
}) => {
  const { type, value } = remark;
  if (type === "genesis") return <Text variant="body2">Genesis</Text>;

  const isGovernance = type === "governance";
  const textFormat = isGovernance ? "normal" : "truncate";
  return (
    <Flex
      direction="column"
      sx={{
        "& > p:first-of-type": {
          color: "text.dark",
          fontSize: "12px",
        },
      }}
      mb={{ base: 0, md: "2px" }}
    >
      <p>{isGovernance ? "Through Proposal ID" : "Tx Hash"}</p>
      <ExplorerLink
        type={isGovernance ? "proposal_id" : "tx_hash"}
        value={value.toString()}
        showCopyOnHover
        textFormat={textFormat}
      />
    </Flex>
  );
};

interface MutateEventsTableRowProps extends CollectionMutateEvent {
  templateColumns: string;
}

export const MutateEventsTableRow = ({
  timestamp,
  templateColumns,
  mutatedFieldName,
  oldValue,
  newValue,
  remark,
}: MutateEventsTableRowProps) => {
  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        _hover={{ background: "gray.900" }}
        transition="all 0.25s ease-in-out"
      >
        <TableRow pr={1}>
          <Badge>{mutatedFieldName}</Badge>
        </TableRow>
        <TableRow>{oldValue}</TableRow>
        <TableRow px={10}>
          <CustomIcon name="arrow-right" />
        </TableRow>
        <TableRow>{newValue}</TableRow>
        <TableRow>
          <Box>
            <Text fontSize="14px" color="gray.400">
              {formatUTC(timestamp)}
            </Text>
            <Text fontSize="12px" color="gray.500">
              ({dateFromNow(timestamp)})
            </Text>
          </Box>
        </TableRow>
        <TableRow>
          <RemarkRender remark={remark} />
        </TableRow>
      </Grid>
    </Box>
  );
};
