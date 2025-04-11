import type { GridProps } from "@chakra-ui/react";
import type { Block } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

interface BlocksTableRowProps {
  templateColumns: GridProps["templateColumns"];
  blockData: Block;
  showProposer: boolean;
}

export const BlocksTableRow = ({
  templateColumns,
  blockData,
  showProposer,
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
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={() => onRowSelect(blockData.height)}
    >
      <TableRow>
        <ExplorerLink
          showCopyOnHover
          type="block_height"
          value={blockData.height.toString()}
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
          <ValidatorBadge badgeSize={7} validator={blockData.proposer} />
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
          <Text color="text.dark" variant="body2">
            {formatUTC(blockData.timestamp)}
          </Text>
          <Text color="text.disabled" variant="body3">
            ({dateFromNow(blockData.timestamp)})
          </Text>
        </Flex>
      </TableRow>
    </Grid>
  );
};
