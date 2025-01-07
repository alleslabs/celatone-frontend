import { Flex } from "@chakra-ui/react";

import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

import { FailedDetails } from "./FailedDetails";
import { IndirectlyVerifiedDetails } from "./IndirectlyVerifiedDetails";
import { InProgressDetails } from "./InProgressDetails";
import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { VerifiedDetails } from "./VerifiedDetails";

interface WasmVerifySectionProps {
  codeHash: string;
  codeId: number;
  contractAddress?: BechAddr32;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

const WasmVerifySectionBody = ({
  codeHash,
  codeId,
  contractAddress,
  wasmVerifyInfo,
}: WasmVerifySectionProps) => {
  if (!wasmVerifyInfo)
    return (
      <NotVerifiedDetails
        codeHash={codeHash}
        codeId={codeId}
        contractAddress={contractAddress}
      />
    );

  if (wasmVerifyInfo.verificationInfo === null) {
    if (wasmVerifyInfo.relatedVerifiedCodes.length === 0)
      return (
        <NotVerifiedDetails
          codeHash={codeHash}
          codeId={codeId}
          contractAddress={contractAddress}
        />
      );

    return (
      <IndirectlyVerifiedDetails
        codeHash={codeHash}
        codeId={codeId}
        contractAddress={contractAddress}
        relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
      />
    );
  }

  if (wasmVerifyInfo.verificationInfo.errorMessage)
    return (
      <FailedDetails
        codeHash={codeHash}
        codeId={codeId}
        contractAddress={contractAddress}
        relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
        verificationInfo={wasmVerifyInfo.verificationInfo}
      />
    );

  if (wasmVerifyInfo.verificationInfo.comparedTimestamp === null)
    return (
      <InProgressDetails
        codeHash={codeHash}
        codeId={codeId}
        contractAddress={contractAddress}
        relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
        verificationInfo={wasmVerifyInfo.verificationInfo}
      />
    );

  return (
    <VerifiedDetails
      schema={wasmVerifyInfo.schema}
      codeHash={codeHash}
      contractAddress={contractAddress}
      relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
      verificationInfo={wasmVerifyInfo.verificationInfo}
    />
  );
};

export const WasmVerifySection = (props: WasmVerifySectionProps) => (
  <Flex
    alignItems={{ base: "start", md: "center" }}
    gap={2}
    w="full"
    direction={{ base: "column", md: "row" }}
    justifyContent="space-between"
  >
    <WasmVerifySectionBody {...props} />
  </Flex>
);
