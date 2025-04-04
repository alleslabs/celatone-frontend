import { Accordion, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { trackUseExpandAll } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import type { ProposalData } from "lib/types";
import { jsonPrettify } from "lib/utils";

import { ProposalMessageCard } from "./ProposalMessageCard";

interface ProposalMessagesProps {
  messages: ProposalData["messages"];
}

export const ProposalMessages = ({ messages }: ProposalMessagesProps) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  useEffect(() => {
    setExpandedIndexes(messages?.length === 1 ? [0] : []);
  }, [messages]);

  const hasMsgs = messages && messages.length > 0;

  return (
    <Flex
      direction="column"
      gap={4}
      pt={2}
      pb={hasMsgs ? 0 : 8}
      borderBottom={{ base: hasMsgs ? "0px" : "1px solid", md: "0px" }}
      borderColor="gray.700"
    >
      <Flex w="full" alignItems="center" justifyContent="space-between">
        <Heading as="h6" variant="h6">
          Proposal messages
        </Heading>
        {hasMsgs && (
          <Button
            variant="ghost-primary"
            minW={{ base: "auto", md: 32 }}
            size="sm"
            rightIcon={
              <CustomIcon
                name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                boxSize={3}
              />
            }
            onClick={() => {
              trackUseExpandAll(
                expandedIndexes.length ? "collapse" : "expand",
                "Proposal messages"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(messages.length).keys()) : []
              );
            }}
          >
            {expandedIndexes.length ? "Collapse all" : "Expand all"}
          </Button>
        )}
      </Flex>
      {hasMsgs ? (
        <Accordion
          allowMultiple
          width="full"
          variant="transparent"
          index={expandedIndexes}
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
        >
          {messages.map((item, i) => (
            <ProposalMessageCard
              key={`msg-${i.toString()}-${JSON.stringify(item)}`}
              header={`[${i}] ${item["@type"]}`}
              jsonString={jsonPrettify(JSON.stringify(item))}
            />
          ))}
        </Accordion>
      ) : (
        <Text variant="body1" color="text.dark">
          The proposal has no message.
        </Text>
      )}
    </Flex>
  );
};
