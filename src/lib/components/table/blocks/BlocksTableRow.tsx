import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { Block } from "lib/types";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

interface BlocksTableRowProps {
  blockData: Block;
  showProposer: boolean;
  templateColumns: GridProps["templateColumns"];
}

export const BlocksTableRow = ({
  blockData,
  showProposer,
  templateColumns,
}: BlocksTableRowProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (blockHeight: number) =>
    navigate({
      pathname: "/blocks/[blockHeight]",
      query: { blockHeight },
    });

  return (
    <Grid
      className="copier-wrapper"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      onClick={() => onRowSelect(blockData.height)}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow>
        <ExplorerLink
          type="block_height"
          value={blockData.height.toString()}
          showCopyOnHover
        >
          {blockData.height}
        </ExplorerLink>
      </TableRow>
      <TableRow>
        <Text fontFamily="mono">
          {truncate(
            blockData.hash.toUpperCase(),
            showProposer ? [6, 6] : [9, 9]
          )}
        </Text>
      </TableRow>
      {showProposer && (
        <TableRow>
          <ValidatorBadge validator={blockData.proposer} badgeSize={7} />
        </TableRow>
      )}
      <TableRow
        color={blockData.txCount === 0 ? "text.dark" : "text.main"}
        justifyContent="center"
      >
        {blockData.txCount}
      </TableRow>
      <TableRow>
        <Flex direction="column">
          <Text variant="body2" color="text.dark">
            {formatUTC(blockData.timestamp)}
          </Text>
          <Text variant="body3" color="text.disabled">
            ({dateFromNow(blockData.timestamp)})
          </Text>
        </Flex>
      </TableRow>
    </Grid>
  );
};
