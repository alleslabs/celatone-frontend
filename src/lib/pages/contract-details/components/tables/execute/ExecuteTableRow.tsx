import { Flex, Tag, Text, Grid } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon/CustomIcon";
import { TableRow } from "lib/components/table";
import type { ExecuteTransaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";
import { getExecuteMsgTags } from "lib/utils/executeTags";

interface ExecuteTableRowProps {
  transaction: ExecuteTransaction;
  templateColumnsStyle: string;
}

export const ExecuteTableRow = ({
  transaction,
  templateColumnsStyle,
}: ExecuteTableRowProps) => {
  return (
    <Grid templateColumns={templateColumnsStyle}>
      <TableRow>
        <ExplorerLink
          value={transaction.hash.toLocaleUpperCase()}
          type="tx_hash"
          canCopyWithHover
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
          {getExecuteMsgTags(transaction.messages, 2).map(
            (tag: string, index: number) => (
              <Tag key={tag + index.toString()} borderRadius="full">
                {tag}
              </Tag>
            )
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
        <Flex direction="column" gap={1}>
          {transaction.created ? (
            <>
              <Text variant="body3">{formatUTC(transaction.created)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(transaction.created)})`}
              </Text>
            </>
          ) : (
            <Text variant="body3">N/A</Text>
          )}
        </Flex>
      </TableRow>
    </Grid>
  );
};
