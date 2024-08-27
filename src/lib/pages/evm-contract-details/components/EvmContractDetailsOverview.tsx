import { Heading, Stack, Text } from "@chakra-ui/react";

export const EvmContractDetailsOverview = () => {
  return (
    <Stack gap={8}>
      <Stack gap={4}>
        <Heading as="h6" variant="h6">
          Contract Info
        </Heading>
        <Text>Contract Information</Text>
      </Stack>
      <Stack gap={4}>
        <Heading as="h6" variant="h6">
          Assets
        </Heading>
        <Text>Assets</Text>
      </Stack>
      <Stack gap={4}>
        <Heading as="h6" variant="h6">
          Transactions
        </Heading>
        <Text>Txs</Text>
      </Stack>
    </Stack>
  );
};
