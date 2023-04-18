import type { GridProps } from "@chakra-ui/react";
import { Flex, Text, Grid } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { BlockInfo } from "lib/types/block";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

interface BlocksRowProps {
  templateColumns: GridProps["templateColumns"];
  blockData: BlockInfo;
}

export const BlocksRow = ({ templateColumns, blockData }: BlocksRowProps) => {
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <ExplorerLink
          type="block_height"
          value={blockData.height.toString()}
          showCopyOnHover
        >
          {blockData.height}
        </ExplorerLink>
      </TableRow>
      <TableRow>{truncate(blockData.hash.toUpperCase())}</TableRow>
      {/* TODO: Wireup Proposer */}
      <TableRow>mitovaloper325KJNUFNU12N4J1KBTDXD</TableRow>
      <TableRow justifyContent="center">{blockData.txCount}</TableRow>
      <TableRow>
        <Flex direction="column">
          <Text variant="body2" color="text.dark" mb="2px">
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
