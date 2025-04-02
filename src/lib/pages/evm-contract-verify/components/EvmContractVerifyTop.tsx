import { Heading, Stack, Text } from "@chakra-ui/react";

export const EvmContractVerifyTop = () => (
  <Stack gap={2}>
    <Heading as="h5" variant="h5">
      Verify & Publish Contract
    </Heading>
    <Text color="text.dark" variant="body2">
      Verifying your contract offers enhanced credibility with a verified badge.
      Once verified, users will able to access its source code in contract
      details page.
    </Text>
  </Stack>
);
