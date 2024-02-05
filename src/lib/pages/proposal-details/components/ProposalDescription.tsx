import { Flex, Heading, Text } from "@chakra-ui/react";

import { Markdown } from "lib/components/Markdown";

interface ProposalDescriptionProps {
  description: string;
}

export const ProposalDescription = ({
  description,
}: ProposalDescriptionProps) => (
  <Flex direction="column" gap={4}>
    <Heading as="h6" variant="h6">
      Proposal Description
    </Heading>
    {description.length === 0 ? (
      <Text variant="body1" color="text.dark">
        Not Provided
      </Text>
    ) : (
      <Flex
        direction="column"
        p={4}
        border="1px solid"
        borderColor="gray.700"
        borderRadius="8px"
      >
        <Markdown markdown={description} />
      </Flex>
    )}
  </Flex>
);
