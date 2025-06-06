import type { BechAddr32 } from "lib/types";

import { Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { WasmVerifyStatus } from "lib/types";

import { ExplorerLink } from "../ExplorerLink";
import { WasmVerifyBadge } from "../WasmVerifyBadge";
import { RelatedVerifiedCodeLinks } from "./RelatedVerifiedCodeLinks";
import { VerifyButton } from "./VerifyButton";

interface IndirectlyVerifiedDetailsProps {
  codeHash: string;
  codeId: number;
  contractAddress?: BechAddr32;
  relatedVerifiedCodes: number[];
}

export const IndirectlyVerifiedDetails = ({
  codeHash,
  codeId,
  contractAddress,
  relatedVerifiedCodes,
}: IndirectlyVerifiedDetailsProps) => {
  const isMobile = useMobile();
  return (
    <>
      <Text color="text.dark" variant="body2">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <ExplorerLink
              rightIcon={
                <WasmVerifyBadge
                  relatedVerifiedCodes={relatedVerifiedCodes}
                  status={WasmVerifyStatus.INDIRECTLY_VERIFIED}
                />
              }
              showCopyOnHover
              type="code_id"
              value={codeId.toString()}
            />{" "}
            which has the same code hash with other verified codes.
          </>
        ) : (
          <>
            This code has the same code hash as the following verified stored
            codes:{" "}
            <RelatedVerifiedCodeLinks
              relatedVerifiedCodes={relatedVerifiedCodes}
            />
            .
          </>
        )}
        <br />
        {isMobile && <br />}
        If you are the code owner, you can verify this code to specify the
        GitHub repository{isMobile && " on the desktop interface"}.
      </Text>
      <VerifyButton
        codeHash={codeHash}
        codeId={codeId}
        contractAddress={contractAddress}
        relatedVerifiedCodes={relatedVerifiedCodes}
        wasmVerifyStatus={WasmVerifyStatus.INDIRECTLY_VERIFIED}
      />
    </>
  );
};
