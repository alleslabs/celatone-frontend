import { Flex, Tag } from "@chakra-ui/react";

import type { Message } from "lib/types";
import { countMessages } from "lib/utils";

interface MultipleActionMsgTypeProps {
  messages: Message[];
}
export const MultipleActionMsgType = ({
  messages,
}: MultipleActionMsgTypeProps) => (
  <Flex gap={1}>
    {countMessages(messages).map(
      (msg) =>
        msg.count !== 0 && (
          <Flex key={msg.type} gap={1}>
            {msg.type} <Tag borderRadius="full">{msg.count}</Tag>
          </Flex>
        )
    )}
  </Flex>
);
