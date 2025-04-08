import type { ProposalData } from "lib/types";

import { Accordion, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { trackUseExpandAll } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { jsonPrettify } from "lib/utils";
import { useEffect, useState } from "react";

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
      borderBottomWidth={{ base: hasMsgs ? "0px" : "1px", md: "0px" }}
      borderColor="gray.700"
      borderStyle="solid"
      direction="column"
      gap={4}
      pb={hasMsgs ? 0 : 8}
      pt={2}
    >
      <Flex alignItems="center" justifyContent="space-between" w="full">
        <Heading as="h6" variant="h6">
          Proposal messages
        </Heading>
        {hasMsgs && (
          <Button
            minW={{ base: "auto", md: 32 }}
            rightIcon={
              <CustomIcon
                boxSize={3}
                name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              />
            }
            size="sm"
            variant="ghost-primary"
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
          index={expandedIndexes}
          variant="transparent"
          width="full"
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
        <Text color="text.dark" variant="body1">
          The proposal has no message.
        </Text>
      )}
    </Flex>
  );
};
