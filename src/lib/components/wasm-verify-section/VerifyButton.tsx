import type { BechAddr32, WasmVerifyStatus } from "lib/types";

import { Button } from "@chakra-ui/react";
import { WasmVerifySubmitModal } from "lib/components/modal";

interface VerifyButtonProps {
  codeId: number;
  codeHash: string;
  wasmVerifyStatus: WasmVerifyStatus;
  relatedVerifiedCodes?: number[];
  contractAddress?: BechAddr32;
  label?: string;
  minW?: string;
}

export const VerifyButton = ({
  codeHash,
  codeId,
  contractAddress,
  label = "Verify code",
  minW = "96px",
  relatedVerifiedCodes,
  wasmVerifyStatus,
}: VerifyButtonProps) => (
  <WasmVerifySubmitModal
    codeHash={codeHash}
    codeId={codeId}
    contractAddress={contractAddress}
    relatedVerifiedCodes={relatedVerifiedCodes}
    triggerElement={
      <Button minW={minW} size="sm" variant="ghost-primary">
        {label}
      </Button>
    }
    wasmVerifyStatus={wasmVerifyStatus}
  />
);
