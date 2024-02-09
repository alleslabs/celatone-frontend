import { Accordion, Button, Flex, Heading } from "@chakra-ui/react";
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

  return (
    <Flex
      direction="column"
      gap={4}
      pt={8}
      borderTop="1px solid"
      borderColor="gray.700"
    >
      <Flex w="full" alignItems="center" justifyContent="space-between">
        <Heading as="h6" variant="h6">
          Proposal Messages
        </Heading>
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
              "account detail resources Tab"
            );
            setExpandedIndexes((prev) =>
              !prev.length ? Array.from(Array(messages?.length).keys()) : []
            );
          }}
        >
          {expandedIndexes.length ? "Collapse All" : "Expand All"}
        </Button>
      </Flex>
      <Accordion
        allowMultiple
        width="full"
        variant="transparent"
        index={expandedIndexes}
        onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
      >
        {messages?.map((item, i) => (
          <ProposalMessageCard
            key={`msg-${item}`}
            header={`[${i}] ${item["@type"]}`}
            jsonString={jsonPrettify(JSON.stringify(item))}
          />
        ))}
      </Accordion>
    </Flex>
  );
};
