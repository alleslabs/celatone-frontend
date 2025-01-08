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
        alignItems="center"
        display="inline-flex"
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        color="primary.main"
        transition="all 0.25s ease-in-out"
        wordBreak="break-all"
      >
        <a data-peer rel="noopener noreferrer" target="_blank" href={metadata}>
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
  <Flex gap={4} direction="column">
    <Heading as="h6" variant="h6">
      Metadata
    </Heading>
    <ProposalMetadataBody metadata={metadata} />
  </Flex>
);
