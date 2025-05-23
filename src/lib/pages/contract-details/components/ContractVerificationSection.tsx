import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { StatusMessageBox } from "lib/components/StatusMessageBox";
import { WasmVerifySection } from "lib/components/wasm-verify-section";

interface ContractVerificationSectionProps {
  codeHash: string;
  codeId: number;
  contractAddress: BechAddr32;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const ContractVerificationSection = ({
  codeHash,
  codeId,
  contractAddress,
  wasmVerifyInfo,
}: ContractVerificationSectionProps) => (
  <Flex direction="column" gap={4} mb={6}>
    <StatusMessageBox
      content={
        <Flex
          alignItems="center"
          gap={2}
          justifyContent="space-between"
          w="full"
        >
          <WasmVerifySection
            codeHash={codeHash}
            codeId={codeId}
            contractAddress={contractAddress}
            wasmVerifyInfo={wasmVerifyInfo}
          />
        </Flex>
      }
    />
  </Flex>
);
