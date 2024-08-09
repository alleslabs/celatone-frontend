import { Flex } from "@chakra-ui/react";

import { StatusMessageBox } from "lib/components/StatusMessageBox";
import { WasmVerifySection } from "lib/components/wasm-verify-section";
import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

interface ContractVerificationSectionProps {
  codeId: number;
  codeHash: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
  contractAddress: BechAddr32;
}

export const ContractVerificationSection = ({
  codeHash,
  codeId,
  wasmVerifyInfo,
  contractAddress,
}: ContractVerificationSectionProps) => (
  <Flex direction="column" mb={6} gap={4}>
    <StatusMessageBox
      content={
        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="full"
          gap={2}
        >
          <WasmVerifySection
            codeId={codeId}
            codeHash={codeHash}
            wasmVerifyInfo={wasmVerifyInfo}
            contractAddress={contractAddress}
          />
        </Flex>
      }
    />
  </Flex>
);
