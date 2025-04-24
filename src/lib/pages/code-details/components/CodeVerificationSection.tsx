import type { Nullish, WasmVerifyInfo } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { WasmVerifySection } from "lib/components/wasm-verify-section";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { getWasmVerifyStatus } from "lib/utils";

interface CodeVerificationSectionProps {
  codeHash: string;
  codeId: number;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodeVerificationSection = ({
  codeHash,
  codeId,
  wasmVerifyInfo,
}: CodeVerificationSectionProps) => (
  <Flex direction="column" gap={4} my={8}>
    <Flex alignItems="center" gap={2}>
      <Heading as="h6" variant="h6">
        Verification info
      </Heading>
      <WasmVerifyBadge
        hasText
        relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
        status={getWasmVerifyStatus(wasmVerifyInfo)}
      />
    </Flex>
    <Flex background="gray.900" borderRadius={8} px={6} py={4}>
      <WasmVerifySection
        codeHash={codeHash}
        codeId={codeId}
        wasmVerifyInfo={wasmVerifyInfo}
      />
    </Flex>
  </Flex>
);
