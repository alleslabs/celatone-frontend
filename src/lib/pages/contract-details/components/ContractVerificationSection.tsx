import { Flex } from "@chakra-ui/react";

import { StatusMessageBox } from "lib/components/StatusMessageBox";
import { WasmVerifySection } from "lib/components/wasm-verify-section";
import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

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
  <Flex gap={4} mb={6} direction="column">
    <StatusMessageBox
      content={
        <Flex
          alignItems="center"
          gap={2}
          w="full"
          justifyContent="space-between"
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
