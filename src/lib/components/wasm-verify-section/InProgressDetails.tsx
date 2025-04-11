import type { BechAddr32, WasmVerifyInfoBase } from "lib/types";

import { Button, Spacer, Text } from "@chakra-ui/react";
import { WasmVerifyStatusModal } from "lib/components/modal";

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
        <CustomIcon boxSize={4} color="gray.400" ml={0} name="hourglass" />
        <Text color="text.dark" variant="body2">
          This contract is an instance of code ID{" "}
          <ExplorerLink
            showCopyOnHover
            type="code_id"
            value={codeId.toString()}
          />{" "}
          which is currently undergoing verification. This can take several
          hours, depending on the code complexity.
        </Text>
        <Spacer />
      </>
    ) : (
      <Text color="text.dark" variant="body2">
        Code verification is in progress and may take several hours depending on
        code complexity.
      </Text>
    )}
    <WasmVerifyStatusModal
      codeHash={codeHash}
      relatedVerifiedCodes={relatedVerifiedCodes}
      triggerElement={
        <Button size="sm" variant="ghost-primary">
          View verification details
        </Button>
      }
      verificationInfo={verificationInfo}
    />
  </>
);
