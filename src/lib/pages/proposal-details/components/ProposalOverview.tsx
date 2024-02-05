import { Flex, Grid, GridItem, Heading, Text, Box } from "@chakra-ui/react";

import { JsonInfo } from "lib/components/json/JsonInfo";
import { Markdown } from "lib/components/Markdown";
import type { ProposalData } from "lib/types";
import { isUrl, jsonPrettify } from "lib/utils";

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

interface ProposalOverviewProps {
  proposalData: ProposalData;
}

const RenderMetadata = ({ proposalData }: ProposalOverviewProps) => {
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
        wordBreak="break-all"
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
export const ProposalOverview = ({ proposalData }: ProposalOverviewProps) => {
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
                p={4}
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
            <RenderMetadata proposalData={proposalData} />
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
            {proposalData.messages?.length ? (
              <>
                {proposalData.messages.map((item, i) => (
                  <JsonInfo
                    header={`[${i}] ${item["@type"]}`}
                    jsonString={jsonPrettify(JSON.stringify(item))}
                    defaultExpand={proposalData.messages?.length === 1}
                    key={`msg-${item}`}
                  />
                ))}
              </>
            ) : (
              <Text variant="body1" color="text.dark">
                No Messages
              </Text>
            )}
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
