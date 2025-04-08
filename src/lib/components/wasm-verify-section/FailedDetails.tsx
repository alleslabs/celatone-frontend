import type { BechAddr32, WasmVerifyInfoBase } from "lib/types";

import { Button, Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { WasmVerifyStatusModal } from "lib/components/modal";
import { formatUTC, getWasmVerifyStatus } from "lib/utils";

import { ExplorerLink } from "../ExplorerLink";
import { RelatedVerifiedCodeLinks } from "./RelatedVerifiedCodeLinks";
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
      <Text color="text.dark" variant="body2">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <ExplorerLink
              showCopyOnHover
              type="code_id"
              value={codeId.toString()}
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
          codeHash={codeHash}
          relatedVerifiedCodes={relatedVerifiedCodes}
          triggerElement={
            <Button size="sm" variant="ghost-primary">
              View details
            </Button>
          }
          verificationInfo={verificationInfo}
        />
        {!isMobile && (
          <VerifyButton
            codeHash={codeHash}
            codeId={codeId}
            label="Reverify Code"
            label="Reverify code"
            relatedVerifiedCodes={relatedVerifiedCodes}
            relatedVerifiedCodes={relatedVerifiedCodes}
            wasmVerifyStatus={getWasmVerifyStatus({
              verificationInfo,
              schema: null,
              relatedVerifiedCodes,
            })}
          />
        )}
      </Flex>
    </>
  );
};
