import { Button } from "@chakra-ui/react";

import { WasmVerifySubmitModal } from "lib/components/modal";
import type { BechAddr32, WasmVerifyStatus } from "lib/types";

interface VerifyButtonProps {
  codeHash: string;
  codeId: number;
  contractAddress?: BechAddr32;
  label?: string;
  minW?: string;
  relatedVerifiedCodes?: number[];
  wasmVerifyStatus: WasmVerifyStatus;
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
    triggerElement={
      <Button minW={minW} size="sm" variant="ghost-primary">
        {label}
      </Button>
    }
    wasmVerifyStatus={wasmVerifyStatus}
    codeHash={codeHash}
    codeId={codeId}
    contractAddress={contractAddress}
    relatedVerifiedCodes={relatedVerifiedCodes}
  />
);
