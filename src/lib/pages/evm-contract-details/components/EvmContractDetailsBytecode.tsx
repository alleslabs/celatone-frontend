import { Heading, Stack } from "@chakra-ui/react";
import { NotVerifiedDetails } from "lib/components/evm-verify-section";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { HexAddr20 } from "lib/types";

interface EvmContractDetailsBytecodeProps {
  code: string;
  contractAddress: HexAddr20;
}

export const EvmContractDetailsBytecode = ({
  code,
  contractAddress,
}: EvmContractDetailsBytecodeProps) => (
  <Stack gap={8}>
    {/* // TODO: Support all status */}
    <NotVerifiedDetails contractAddress={contractAddress} />
    <Stack gap={4}>
      <Heading as="h6" variant="h7">
        ByteCode
      </Heading>
      <TextReadOnly text={code} canCopy />
    </Stack>
  </Stack>
);
