import type { JsonFragment } from "ethers";

import { Heading, Stack } from "@chakra-ui/react";
import JsonReadOnly from "lib/components/json/JsonReadOnly";

interface ContractAbiProps {
  abi: JsonFragment[];
}

export const ContractAbi = ({ abi }: ContractAbiProps) => (
  <Stack gap={4}>
    <Heading as="h6" variant="h7">
      Contract ABI
    </Heading>
    <JsonReadOnly text={JSON.stringify(abi, null, 2)} />
  </Stack>
);
