import { Flex, Icon, Tag, Text, Grid } from "@chakra-ui/react";
import { MdCheck } from "react-icons/md";

import { StyledTableRow } from "../tableStyle";
import { ExplorerLink } from "lib/components/ExplorerLink";
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
      <StyledTableRow>
        <ExplorerLink
          value={transaction.hash.toLocaleUpperCase()}
          type="tx_hash"
          canCopyWithHover
        />
      </StyledTableRow>
      <StyledTableRow>
        <Icon
          as={MdCheck}
          fontSize="24px"
          color={transaction.success ? "success.main" : "error.main"}
        />
      </StyledTableRow>
      <StyledTableRow>
        <Flex gap={1} flexWrap="wrap">
          {getExecuteMsgTags(transaction.messages, 2).map(
            (tag: string, index: number) => (
              <Tag key={tag + index.toString()} borderRadius="full">
                {tag}
              </Tag>
            )
          )}
        </Flex>
      </StyledTableRow>

      <StyledTableRow>
        <ExplorerLink
          value={transaction.sender}
          type="user_address"
          canCopyWithHover
        />
      </StyledTableRow>
      <StyledTableRow>
        <ExplorerLink
          value={transaction.height.toString()}
          type="block"
          canCopyWithHover
        />
      </StyledTableRow>
      <StyledTableRow>
        <Flex direction="column" gap={1}>
          <Text variant="body2">
            {formatUTC(transaction.created.toString())}
          </Text>
          <Text variant="body2" color="text.dark">
            {`(${dateFromNow(transaction.created.toString())})`}
          </Text>
        </Flex>
      </StyledTableRow>
    </Grid>
  );
};
