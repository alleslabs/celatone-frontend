import { Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

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
export const ProposalOverview = () => {
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
            <Text variant="body1" wordBreak="break-word">
              This is a proposal to give the address
              osmo1raa4kyx5ypz75qqk3566c6slx2mw3qzsu6rymw permission to upload
              CosmWasm contracts to Osmosis without seeking governance approval
              for subsequent uploads. Deploying this contract will allow Skip to
              leverage Osmosis swap hooks to build a service that simplifies
              cross-chain transfers, swaps, and fee management. Skip will
              provide this functionality via our free API, which enables
              applications anywhere in Cosmos to seamlessly draw on Osmosis
              liquidity. While this proposal gives authority for
              osmo1raa4kyx5ypz75qqk3566c6slx2mw3qzsu6rymw to permissionlessly
              upload CosmWasm contracts to Osmosis, governance only signals
              approval for contracts relating to the function of Skip API
              service. Details can be seen in the Commonwealth thread:
              https://gov.osmosis.zone/discussion/11973-skip-api-contract-upload
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
