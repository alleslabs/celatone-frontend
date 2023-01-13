import { Flex, Tag } from "@chakra-ui/react";

import type { Message } from "lib/types";
import { countMessages } from "lib/utils";

interface MultipleActionMsgTypeProps {
  messages: Message[];
}
export const MultipleActionMsgType = ({
  messages,
}: MultipleActionMsgTypeProps) => {
  const displayMessagesCount = countMessages(messages).filter(
    (msg) => msg.count !== 0
  );
  return (
    <Flex gap={1}>
      {displayMessagesCount.map((msg, index) => (
        <Flex key={msg.type} gap={1}>
          {msg.type} <Tag borderRadius="full">{msg.count}</Tag>
          {index < displayMessagesCount.length - 1 && ","}
        </Flex>
      ))}
    </Flex>
  );
};
