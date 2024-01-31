import { Flex, Grid, GridItem, Heading } from "@chakra-ui/react";

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

interface ProposalOverviewProps {
  proposalData: ProposalData;
}
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
