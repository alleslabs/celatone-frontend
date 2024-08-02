import { Flex } from "@chakra-ui/react";

import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

import { FailedDetails } from "./FailedDetails";
import { IndirectlyVerifiedDetails } from "./IndirectlyVerifiedDetails";
import { InProgressDetails } from "./InProgressDetails";
import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { VerifiedDetails } from "./VerifiedDetails";

interface WasmVerifySectionProps {
  codeId: number;
  codeHash: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
  contractAddress?: BechAddr32;
}

const WasmVerifySectionBody = ({
  codeId,
  codeHash,
  wasmVerifyInfo,
  contractAddress,
}: WasmVerifySectionProps) => {
  if (!wasmVerifyInfo)
    return (
      <NotVerifiedDetails
        codeId={codeId}
        codeHash={codeHash}
        contractAddress={contractAddress}
      />
    );

  if (wasmVerifyInfo.verificationInfo === null) {
    if (wasmVerifyInfo.schema === null)
      return (
        <NotVerifiedDetails
          codeId={codeId}
          codeHash={codeHash}
          contractAddress={contractAddress}
        />
      );

    return (
      <IndirectlyVerifiedDetails
        codeId={codeId}
        codeHash={codeHash}
        relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
        contractAddress={contractAddress}
      />
    );
  }

  if (wasmVerifyInfo.verificationInfo.errorMessage)
    return (
      <FailedDetails
        codeId={codeId}
        codeHash={codeHash}
        verificationInfo={wasmVerifyInfo.verificationInfo}
        relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
        contractAddress={contractAddress}
      />
    );

  if (wasmVerifyInfo.verificationInfo.comparedTimestamp === null)
    return (
      <InProgressDetails
        codeId={codeId}
        codeHash={codeHash}
        verificationInfo={wasmVerifyInfo.verificationInfo}
        relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
        contractAddress={contractAddress}
      />
    );

  return (
    <VerifiedDetails
      codeHash={codeHash}
      verificationInfo={wasmVerifyInfo.verificationInfo}
      schema={wasmVerifyInfo.schema}
      relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
      contractAddress={contractAddress}
    />
  );
};

export const WasmVerifySection = (props: WasmVerifySectionProps) => (
  <Flex justifyContent="space-between" alignItems="center" w="full" gap={2}>
    <WasmVerifySectionBody {...props} />
  </Flex>
);
