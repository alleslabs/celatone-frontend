import { Heading, Stack } from "@chakra-ui/react";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { Option } from "lib/types";

export interface ContractByteCodeProps {
  byteCode: Option<string>;
  deployedByteCode: string;
}

export const ContractByteCode = ({
  byteCode = "",
  deployedByteCode,
}: ContractByteCodeProps) => (
  <Stack gap={8}>
    <Stack gap={4}>
      <Heading as="h6" variant="h7">
        ByteCode
      </Heading>
      <TextReadOnly text={byteCode} canCopy />
    </Stack>
    <Stack gap={4}>
      <Heading as="h6" variant="h7">
        Deployed ByteCode
      </Heading>
      <TextReadOnly text={deployedByteCode} canCopy />
    </Stack>
  </Stack>
);
