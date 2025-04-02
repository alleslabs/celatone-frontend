import type { Option } from "lib/types";

import { Heading, Stack } from "@chakra-ui/react";
import { TextReadOnly } from "lib/components/json/TextReadOnly";

export interface ContractByteCodeProps {
  byteCode: Option<string>;
  deployedByteCode: string;
}

export const ContractByteCode = ({
  byteCode,
  deployedByteCode,
}: ContractByteCodeProps) => (
  <Stack gap={8}>
    {byteCode && (
      <Stack gap={4}>
        <Heading as="h6" variant="h7">
          ByteCode
        </Heading>
        <TextReadOnly canCopy text={byteCode} />
      </Stack>
    )}
    <Stack gap={4}>
      <Heading as="h6" variant="h7">
        Deployed ByteCode
      </Heading>
      <TextReadOnly canCopy text={deployedByteCode} />
    </Stack>
  </Stack>
);
