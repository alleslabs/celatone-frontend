import { Flex, Heading } from "@chakra-ui/react";

import { WasmVerifySection } from "lib/components/wasm-verify-section";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { Nullish, WasmVerifyInfo } from "lib/types";
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
  <Flex gap={4} my={8} direction="column">
    <Flex alignItems="center" gap={2}>
      <Heading as="h6" variant="h6">
        Verification Info
      </Heading>
      <WasmVerifyBadge
        hasText
        status={getWasmVerifyStatus(wasmVerifyInfo)}
        relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
      />
    </Flex>
    <Flex px={6} py={4} background="gray.900" borderRadius={8}>
      <WasmVerifySection
        codeHash={codeHash}
        codeId={codeId}
        wasmVerifyInfo={wasmVerifyInfo}
      />
    </Flex>
  </Flex>
);
