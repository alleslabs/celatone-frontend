import type { ProposalData } from "lib/types";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { isUrl } from "lib/utils";

interface ProposalMetadataProps {
  metadata: ProposalData["metadata"];
}

const ProposalMetadataBody = ({ metadata }: ProposalMetadataProps) => {
  if (metadata.length === 0) {
    return (
      <Text color="text.dark" variant="body1">
        Not Provided
      </Text>
    );
  }
  if (isUrl(metadata)) {
    return (
      <Box
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        alignItems="center"
        color="primary.main"
        display="inline-flex"
        transition="all 0.25s ease-in-out"
        wordBreak="break-all"
      >
        <a data-peer href={metadata} rel="noopener noreferrer" target="_blank">
          {metadata}
        </a>
      </Box>
    );
  }

  return (
    <Text color="text.main" variant="body1" wordBreak="break-word">
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
