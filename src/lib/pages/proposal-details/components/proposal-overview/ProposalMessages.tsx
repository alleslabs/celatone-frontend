import { Flex, Heading, Text } from "@chakra-ui/react";

import { JsonInfo } from "lib/components/json/JsonInfo";
import type { ProposalData } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface ProposalMessagesProps {
  messages: ProposalData["messages"];
}

export const ProposalMessages = ({ messages }: ProposalMessagesProps) => (
  <Flex
    direction="column"
    gap={4}
    pt={8}
    borderTop="1px solid"
    borderColor="gray.700"
  >
    <Heading as="h6" variant="h6">
      Proposal Messages
    </Heading>
    {messages?.length ? (
      <>
        {messages.map((item, i) => (
          <JsonInfo
            header={`[${i}] ${item["@type"]}`}
            jsonString={jsonPrettify(JSON.stringify(item))}
            defaultExpand={messages?.length === 1}
            key={`msg-${item}`}
          />
        ))}
      </>
    ) : (
      <Text variant="body1" color="text.dark">
        No Messages
      </Text>
    )}
  </Flex>
);
