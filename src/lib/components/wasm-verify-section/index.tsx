import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useIsApiChain } from "lib/app-provider";

import { ExplorerLink } from "../ExplorerLink";
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
  const isApiChain = useIsApiChain({
    shouldRedirect: false,
  });
  if (!isApiChain)
    return (
      <Text color="text.dark" variant="body2">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <ExplorerLink
              showCopyOnHover
              type="code_id"
              value={codeId.toString()}
            />
            .
          </>
        ) : null}{" "}
        Verification is only available on official networks
      </Text>
    );

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
      codeHash={codeHash}
      contractAddress={contractAddress}
      relatedVerifiedCodes={wasmVerifyInfo.relatedVerifiedCodes}
      schema={wasmVerifyInfo.schema}
      verificationInfo={wasmVerifyInfo.verificationInfo}
    />
  );
};

export const WasmVerifySection = (props: WasmVerifySectionProps) => (
  <Flex
    alignItems={{ base: "start", md: "center" }}
    direction={{ base: "column", md: "row" }}
    gap={2}
    justifyContent="space-between"
    w="full"
  >
    <WasmVerifySectionBody {...props} />
  </Flex>
);
