import { Heading, Stack } from "@chakra-ui/react";

export const ContractAbi = () => (
  <Stack gap={4}>
    <Heading as="h6" variant="h7">
      Contract ABI
    </Heading>
    {/* <TextReadOnly text={deployedCode} canCopy /> */}
  </Stack>
);
