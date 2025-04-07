import { Button, Spacer, Text } from "@chakra-ui/react";

import { WasmVerifyStatusModal } from "lib/components/modal";
import type { BechAddr32, WasmVerifyInfoBase } from "lib/types";
import { ExplorerLink } from "../ExplorerLink";
import { CustomIcon } from "../icon";

interface InProgressDetailsProps {
  codeId: number;
  codeHash: string;
  verificationInfo: WasmVerifyInfoBase;
  relatedVerifiedCodes: number[];
  contractAddress?: BechAddr32;
}

export const InProgressDetails = ({
  codeId,
  codeHash,
  verificationInfo,
  relatedVerifiedCodes,
  contractAddress,
}: InProgressDetailsProps) => (
  <>
    {contractAddress ? (
      <>
        <CustomIcon name="hourglass" boxSize={4} ml={0} color="gray.400" />
        <Text variant="body2" color="text.dark">
          This contract is an instance of code ID{" "}
          <ExplorerLink
            value={codeId.toString()}
            type="code_id"
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
      codeHash={codeHash}
      verificationInfo={verificationInfo}
      relatedVerifiedCodes={relatedVerifiedCodes}
      triggerElement={
        <Button variant="ghost-primary" size="sm">
          View verification details
        </Button>
      }
    />
  </>
);
