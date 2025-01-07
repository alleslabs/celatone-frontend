import { Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { WasmVerifyBadge } from "../WasmVerifyBadge";
import { useMobile } from "lib/app-provider";
import type { BechAddr32 } from "lib/types";
import { WasmVerifyStatus } from "lib/types";

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
      <Text variant="body2" color="text.dark">
        {contractAddress ? (
          <>
            This contract is an instance of code ID{" "}
            <ExplorerLink
              type="code_id"
              value={codeId.toString()}
              rightIcon={
                <WasmVerifyBadge
                  status={WasmVerifyStatus.INDIRECTLY_VERIFIED}
                  relatedVerifiedCodes={relatedVerifiedCodes}
                />
              }
              showCopyOnHover
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
        wasmVerifyStatus={WasmVerifyStatus.INDIRECTLY_VERIFIED}
        codeHash={codeHash}
        codeId={codeId}
        contractAddress={contractAddress}
        relatedVerifiedCodes={relatedVerifiedCodes}
      />
    </>
  );
};
