import { Flex, Heading } from "@chakra-ui/react";

import { WasmVerifySection } from "lib/components/wasm-verify-section";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { Nullish, WasmVerifyInfo } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

interface CodeVerificationSectionProps {
  codeId: number;
  codeHash: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodeVerificationSection = ({
  codeId,
  codeHash,
  wasmVerifyInfo,
}: CodeVerificationSectionProps) => (
  <Flex direction="column" my={8} gap={4}>
    <Flex gap={2} alignItems="center">
      <Heading as="h6" variant="h6">
        Verification info
      </Heading>
      <WasmVerifyBadge
        status={getWasmVerifyStatus(wasmVerifyInfo)}
        relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
        hasText
      />
    </Flex>
    <Flex background="gray.900" borderRadius={8} px={6} py={4}>
      <WasmVerifySection
        codeId={codeId}
        codeHash={codeHash}
        wasmVerifyInfo={wasmVerifyInfo}
      />
    </Flex>
  </Flex>
);
