import { Badge, Flex } from "@chakra-ui/react";

import type { Message } from "lib/types";
import { countMessages } from "lib/utils";

interface MultipleActionsMsgProps {
  messages: Message[];
}
export const MultipleActionsMsg = ({ messages }: MultipleActionsMsgProps) => {
  const displayMessagesCount = countMessages(messages).filter(
    (msg) => msg.count !== 0
  );
  return (
    <Flex gap={1} flexWrap="wrap">
      {displayMessagesCount.map((msg, index) => (
        <Flex key={msg.type} gap={1}>
          {msg.type} <Badge>{msg.count}</Badge>
          {index < displayMessagesCount.length - 1 && ","}
        </Flex>
      ))}
    </Flex>
  );
};
