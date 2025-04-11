import type { ProposalData } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { Markdown } from "lib/components/Markdown";

interface ProposalDescriptionProps {
  description: ProposalData["description"];
}

export const ProposalDescription = ({
  description,
}: ProposalDescriptionProps) => (
  <Flex direction="column" gap={4}>
    <Heading as="h6" variant="h6">
      Proposal description
    </Heading>
    {description.length === 0 ? (
      <Text color="text.dark" variant="body1">
        Not Provided
      </Text>
    ) : (
      <Flex border="1px solid" borderColor="gray.700" borderRadius="8px" p={4}>
        <Markdown markdown={description} />
      </Flex>
    )}
  </Flex>
);
