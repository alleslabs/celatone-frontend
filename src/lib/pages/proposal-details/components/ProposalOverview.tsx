import { Flex, Grid, GridItem, Heading, Text, Box } from "@chakra-ui/react";

import { Markdown } from "lib/components/Markdown";
import type { ProposalData } from "lib/types";

const ProposalStatus = () => {
  return (
    <Flex
      borderRadius="8px"
      border="1px solid"
      borderColor="gray.700"
      background="gray.900"
      p={4}
    >
      Current Status component
    </Flex>
  );
};

const isUrl = (metadata: string): boolean => {
  const urlRegex =
    // eslint-disable-next-line no-useless-escape
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  return urlRegex.test(metadata);
};
interface ProposalOverviewProps {
  proposalData: ProposalData;
}
export const ProposalOverview = ({ proposalData }: ProposalOverviewProps) => {
  const renderMetadata = () => {
    if (proposalData.metadata.length === 0) {
      return (
        <Text variant="body1" color="text.dark">
          Not Provided
        </Text>
      );
    }

    if (isUrl(proposalData.metadata)) {
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
        >
          <a
            href={proposalData.metadata}
            target="_blank"
            rel="noopener noreferrer"
            data-peer
          >
            {proposalData.metadata}
          </a>
        </Box>
      );
    }

    return (
      <Text variant="body1" color="text.main" wordBreak="break-word">
        {proposalData.metadata}
      </Text>
    );
  };

  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", xl: "2fr 1fr" }}
      gridGap={16}
      mt={8}
    >
      <GridItem>
        <Flex direction="column" gap={8}>
          <ProposalStatus />
          <Flex direction="column" gap={4}>
            <Heading as="h6" variant="h6">
              Proposal Description
            </Heading>
            {proposalData.description.length === 0 ? (
              <Text variant="body1" color="text.dark">
                Not Provided
              </Text>
            ) : (
              <Flex
                direction="column"
                gap={4}
                p={6}
                border="1px solid"
                borderColor="gray.700"
                borderRadius="8px"
              >
                <Markdown markdown={proposalData.description} />
              </Flex>
            )}
          </Flex>
          <Flex direction="column" gap={4}>
            <Heading as="h6" variant="h6">
              Metadata
            </Heading>
            <Text
              variant="body1"
              color={proposalData.metadata.length ? "text.main" : "text.dark"}
              wordBreak="break-word"
            >
              {renderMetadata()}
            </Text>
          </Flex>
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
            <Flex
              background="gray.900"
              minH={64}
              alignItems="center"
              justifyContent="center"
            >
              Proposal message content
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
      <GridItem>
        <Heading as="h6" variant="h6" mb={4}>
          Proposal Period
        </Heading>
        <Flex
          background="gray.900"
          minH={64}
          alignItems="center"
          justifyContent="center"
        >
          Proposal period content
        </Flex>
      </GridItem>
    </Grid>
  );
};
