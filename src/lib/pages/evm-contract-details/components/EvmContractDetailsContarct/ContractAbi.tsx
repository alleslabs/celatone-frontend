import { Heading, Stack } from "@chakra-ui/react";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

interface ContractAbiProps {
  abi: string;
}

export const ContractAbi = ({ abi }: ContractAbiProps) => (
  <Stack gap={4}>
    <Heading as="h6" variant="h7">
      Contract ABI
    </Heading>
    <JsonReadOnly text={jsonPrettify(abi)} />
  </Stack>
);
