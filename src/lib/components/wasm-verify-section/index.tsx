import { Flex, Text } from "@chakra-ui/react";

import { observer } from "mobx-react-lite";
import { useIsLocalChainIdExist } from "lib/app-provider/hooks/useLocalChainConfig";
import type { BechAddr32, Nullish, WasmVerifyInfo } from "lib/types";

import { FailedDetails } from "./FailedDetails";
import { IndirectlyVerifiedDetails } from "./IndirectlyVerifiedDetails";
import { InProgressDetails } from "./InProgressDetails";
import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { VerifiedDetails } from "./VerifiedDetails";
import { ExplorerLink } from "../ExplorerLink";

interface WasmVerifySectionProps {
  codeId: number;
  codeHash: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
  contractAddress?: BechAddr32;
}

const WasmVerifySectionBody = observer(
  ({
    codeId,
    codeHash,
    wasmVerifyInfo,
    contractAddress,
  }: WasmVerifySectionProps) => {
    const isLocalChainIdExist = useIsLocalChainIdExist({
      shouldRedirect: false,
    });
    if (isLocalChainIdExist)
      return (
        <Text variant="body2" color="text.dark">
          {contractAddress ? (
            <>
              This contract is an instance of code ID{" "}
              <ExplorerLink
                value={codeId.toString()}
                type="code_id"
                showCopyOnHover
              />
              .
            </>
          ) : null}{" "}
          Verification is only available on Initia (Layer 1) and Rollups (Layer
          2).
        </Text>
      );

    if (!wasmVerifyInfo)
      return (
        <NotVerifiedDetails
          codeId={codeId}
          codeHash={codeHash}
          contractAddress={contractAddress}
        />
      );

    if (wasmVerifyInfo.verificationInfo === null) {
      if (wasmVerifyInfo.relatedVerifiedCodes.length === 0)
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
  }
);

export const WasmVerifySection = (props: WasmVerifySectionProps) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    alignItems={{ base: "start", md: "center" }}
    justifyContent="space-between"
    w="full"
    gap={2}
  >
    <WasmVerifySectionBody {...props} />
  </Flex>
);
