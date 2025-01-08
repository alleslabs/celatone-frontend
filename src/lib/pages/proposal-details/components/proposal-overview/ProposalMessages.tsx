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
      gap={4}
      pb={hasMsgs ? 0 : 8}
      pt={2}
      borderBottom={{ base: hasMsgs ? "0px" : "1px solid", md: "0px" }}
      borderColor="gray.700"
      direction="column"
    >
      <Flex alignItems="center" w="full" justifyContent="space-between">
        <Heading as="h6" variant="h6">
          Proposal Messages
        </Heading>
        {hasMsgs && (
          <Button
            minW={{ base: "auto", md: 32 }}
            size="sm"
            variant="ghost-primary"
            onClick={() => {
              trackUseExpandAll(
                expandedIndexes.length ? "collapse" : "expand",
                "Proposal Messages"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(messages.length).keys()) : []
              );
            }}
            rightIcon={
              <CustomIcon
                name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                boxSize={3}
              />
            }
          >
            {expandedIndexes.length ? "Collapse All" : "Expand All"}
          </Button>
        )}
      </Flex>
      {hasMsgs ? (
        <Accordion
          width="full"
          index={expandedIndexes}
          variant="transparent"
          allowMultiple
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
