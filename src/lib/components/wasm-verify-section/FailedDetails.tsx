import { Button, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { useMobile } from "lib/app-provider";
import { WasmVerifyStatusModal } from "lib/components/modal";
import type { BechAddr32, WasmVerifyInfoBase } from "lib/types";
import { formatUTC, getWasmVerifyStatus } from "lib/utils";

import { RelatedVerifiedCodeLinks } from "./RelatedVerifiedCodeLinks";
import { VerifyButton } from "./VerifyButton";

interface FailedDetailsProps {
  codeHash: string;
  codeId: number;
  contractAddress?: BechAddr32;
  relatedVerifiedCodes: number[];
  verificationInfo: WasmVerifyInfoBase;
}

export const FailedDetails = ({
  codeHash,
  codeId,
  contractAddress,
  relatedVerifiedCodes,
  verificationInfo,
}: FailedDetailsProps) => {
  const isMobile = useMobile();
  return (
    <>
      <Text variant="body2" color="text.dark">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <ExplorerLink
              type="code_id"
              value={codeId.toString()}
              showCopyOnHover
            />
            , in which its verification was submitted on{" "}
            {formatUTC(verificationInfo.submittedTimestamp)} but an error
            occurred.
          </>
        ) : (
          <>
            Verification failed: Verification was submitted on{" "}
            {formatUTC(verificationInfo.submittedTimestamp)} but an error
            occurred.
          </>
        )}
        {relatedVerifiedCodes.length > 0 && (
          <>
            <br />
            <br />
            Also this code has the same code hash as the following verified
            stored codes:{" "}
            <RelatedVerifiedCodeLinks
              relatedVerifiedCodes={relatedVerifiedCodes}
            />
            .
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
          triggerElement={
            <Button size="sm" variant="ghost-primary">
              View Details
            </Button>
          }
          codeHash={codeHash}
          relatedVerifiedCodes={relatedVerifiedCodes}
          verificationInfo={verificationInfo}
        />
        {!isMobile && (
          <VerifyButton
            label="Reverify Code"
            wasmVerifyStatus={getWasmVerifyStatus({
              relatedVerifiedCodes,
              schema: null,
              verificationInfo,
            })}
            codeHash={codeHash}
            codeId={codeId}
            relatedVerifiedCodes={relatedVerifiedCodes}
          />
        )}
      </Flex>
    </>
  );
};
