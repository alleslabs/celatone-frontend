import { Flex, Icon, Tag, Td, Tr, Text } from "@chakra-ui/react";
import { MdCheck } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ExecuteTransaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";
import { getExecuteMsgTags } from "lib/utils/executeTags";

interface TableRowProps {
  transaction: ExecuteTransaction;
}

export const ExecuteTableRow = ({ transaction }: TableRowProps) => {
  return (
    <Tr>
      <Td w="15%">
        <ExplorerLink
          value={transaction.hash.toLocaleUpperCase()}
          type="tx_hash"
          canCopyWithHover
        />
      </Td>
      <Td w="5%" textAlign="center">
        <Icon
          as={MdCheck}
          fontSize="24px"
          color={transaction.success ? "success.main" : "error.main"}
        />
      </Td>
      <Td w="30%">
        <Flex gap={1} flexWrap="wrap">
          {getExecuteMsgTags(transaction.messages, 2).map(
            (tag: string, index: number) => (
              <Tag key={tag + index.toString()} borderRadius="full">
                {tag}
              </Tag>
            )
          )}
        </Flex>
      </Td>
      <Td w="15%">
        <ExplorerLink
          value={transaction.sender}
          type="user_address"
          canCopyWithHover
        />
      </Td>
      <Td w="15%">
        <ExplorerLink
          value={transaction.height.toString()}
          type="block"
          canCopyWithHover
        />
      </Td>
      <Td w="20%">
        <Flex direction="column" gap={1}>
          <Text variant="body2">
            {formatUTC(transaction.created.toString())}
          </Text>
          <Text variant="body2" color="text.dark">
            {`(${dateFromNow(transaction.created.toString())})`}
          </Text>
        </Flex>
      </Td>
    </Tr>
  );
};
