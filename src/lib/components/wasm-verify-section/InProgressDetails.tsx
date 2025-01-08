import { Button, Spacer, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { CustomIcon } from "../icon";
import { WasmVerifyStatusModal } from "lib/components/modal";
import type { BechAddr32, WasmVerifyInfoBase } from "lib/types";

interface InProgressDetailsProps {
  codeHash: string;
  codeId: number;
  contractAddress?: BechAddr32;
  relatedVerifiedCodes: number[];
  verificationInfo: WasmVerifyInfoBase;
}

export const InProgressDetails = ({
  codeHash,
  codeId,
  contractAddress,
  relatedVerifiedCodes,
  verificationInfo,
}: InProgressDetailsProps) => (
  <>
    {contractAddress ? (
      <>
        <CustomIcon ml={0} name="hourglass" boxSize={4} color="gray.400" />
        <Text variant="body2" color="text.dark">
          This contract is an instance of code ID{" "}
          <ExplorerLink
            type="code_id"
            value={codeId.toString()}
            showCopyOnHover
          />{" "}
          which is currently undergoing verification. This can take several
          hours, depending on the code complexity.
        </Text>
        <Spacer />
      </>
    ) : (
      <Text variant="body2" color="text.dark">
        Code verification is in progress and may take several hours depending on
        code complexity.
      </Text>
    )}
    <WasmVerifyStatusModal
      triggerElement={
        <Button size="sm" variant="ghost-primary">
          View Verification Details
        </Button>
      }
      codeHash={codeHash}
      relatedVerifiedCodes={relatedVerifiedCodes}
      verificationInfo={verificationInfo}
    />
  </>
);
