import { Heading, Stack } from "@chakra-ui/react";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { Option } from "lib/types";

export interface ContractByteCodeProps {
  code: Option<string>;
  deployedCode: string;
}

export const ContractByteCode = ({
  code = "",
  deployedCode,
}: ContractByteCodeProps) => (
  <Stack gap={8}>
    <Stack gap={4}>
      <Heading as="h6" variant="h7">
        ByteCode
      </Heading>
      <TextReadOnly text={code} canCopy />
    </Stack>
    <Stack gap={4}>
      <Heading as="h6" variant="h7">
        Deployed ByteCode
      </Heading>
      <TextReadOnly text={deployedCode} canCopy />
    </Stack>
  </Stack>
);
