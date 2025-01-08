import { Button } from "@chakra-ui/react";

import { WasmVerifySubmitModal } from "lib/components/modal";
import type { BechAddr32, WasmVerifyStatus } from "lib/types";

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
  codeId,
  codeHash,
  wasmVerifyStatus,
  relatedVerifiedCodes,
  contractAddress,
  label = "Verify code",
  minW = "96px",
}: VerifyButtonProps) => (
  <WasmVerifySubmitModal
    codeId={codeId}
    codeHash={codeHash}
    wasmVerifyStatus={wasmVerifyStatus}
    relatedVerifiedCodes={relatedVerifiedCodes}
    contractAddress={contractAddress}
    triggerElement={
      <Button variant="ghost-primary" size="sm" minW={minW}>
        {label}
      </Button>
    }
  />
);
