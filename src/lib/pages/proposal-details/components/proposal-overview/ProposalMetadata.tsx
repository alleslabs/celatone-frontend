import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import type { ProposalData } from "lib/types";
import { isUrl } from "lib/utils";

interface ProposalMetadataProps {
  metadata: ProposalData["metadata"];
}

const ProposalMetadataBody = ({ metadata }: ProposalMetadataProps) => {
  if (metadata.length === 0) {
    return (
      <Text variant="body1" color="text.dark">
        Not Provided
      </Text>
    );
  }
  if (isUrl(metadata)) {
    return (
      <Box
        display="inline-flex"
        alignItems="center"
        transition="all 0.25s ease-in-out"
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "secondary.light",
        }}
        color="secondary.main"
        wordBreak="break-all"
      >
        <a href={metadata} target="_blank" rel="noopener noreferrer" data-peer>
          {metadata}
        </a>
      </Box>
    );
  }

  return (
    <Text variant="body1" color="text.main" wordBreak="break-word">
      {metadata}
    </Text>
  );
};

export const ProposalMetadata = ({ metadata }: ProposalMetadataProps) => (
  <Flex direction="column" gap={4}>
    <Heading as="h6" variant="h6">
      Metadata
    </Heading>
    <ProposalMetadataBody metadata={metadata} />
  </Flex>
);
