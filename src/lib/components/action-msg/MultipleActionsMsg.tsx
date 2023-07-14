import { Badge, Flex, Text } from "@chakra-ui/react";

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
          <Text variant={{ base: "body2", md: "body1" }}>{msg.type} </Text>
          <Badge>{msg.count}</Badge>
          {index < displayMessagesCount.length - 1 && ","}
        </Flex>
      ))}
    </Flex>
  );
};
