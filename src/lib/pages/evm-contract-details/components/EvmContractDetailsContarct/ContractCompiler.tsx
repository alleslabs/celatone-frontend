import { Heading, Stack } from "@chakra-ui/react";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

interface ContractCompilerProps {
  compilerSettings: string;
}

export const ContractCompiler = ({
  compilerSettings,
}: ContractCompilerProps) => (
  <Stack gap={4}>
    <Heading as="h6" variant="h7">
      Contract ABI
    </Heading>
    <JsonReadOnly text={jsonPrettify(compilerSettings)} />
  </Stack>
);
