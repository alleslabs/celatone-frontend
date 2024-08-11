import { Button, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { useMobile } from "lib/app-provider";
import { WasmVerifyStatusModal } from "lib/components/modal";
import type { BechAddr32, WasmVerifyInfoBase } from "lib/types";
import { formatUTC, getWasmVerifyStatus } from "lib/utils";

import { VerifyButton } from "./VerifyButton";

interface FailedDetailsProps {
  codeId: number;
  codeHash: string;
  verificationInfo: WasmVerifyInfoBase;
  relatedVerifiedCodes: number[];
  contractAddress?: BechAddr32;
}

export const FailedDetails = ({
  codeId,
  codeHash,
  verificationInfo,
  relatedVerifiedCodes,
  contractAddress,
}: FailedDetailsProps) => {
  const isMobile = useMobile();
  return (
    <>
      <Text variant="body2" color="text.dark">
        {contractAddress ? (
          <Text variant="body2" color="text.dark">
            This contract is an instance of code ID{" "}
            <ExplorerLink
              value={codeId.toString()}
              type="code_id"
              showCopyOnHover
            />
            , verification was submitted on{" "}
            {formatUTC(verificationInfo.submittedTimestamp)} but an error
            occurred.
          </Text>
        ) : (
          <>
            Verification failed: Verification was submitted on{" "}
            {formatUTC(verificationInfo.submittedTimestamp)} but an error
            occurred.
          </>
        )}
        {isMobile && (
          <>
            <br />
            <br />
            If you are the code owner, you can reverify this code on the desktop
            interface.
          </>
        )}
      </Text>
      <Flex gap={2}>
        <WasmVerifyStatusModal
          codeHash={codeHash}
          verificationInfo={verificationInfo}
          relatedVerifiedCodes={relatedVerifiedCodes}
          triggerElement={
            <Button variant="ghost-primary" size="sm">
              View Details
            </Button>
          }
        />
        {!isMobile && (
          <VerifyButton
            codeId={codeId}
            codeHash={codeHash}
            wasmVerifyStatus={getWasmVerifyStatus({
              verificationInfo,
              relatedVerifiedCodes,
            })}
            relatedVerifiedCodes={relatedVerifiedCodes}
            label="Reverify Code"
          />
        )}
      </Flex>
    </>
  );
};
