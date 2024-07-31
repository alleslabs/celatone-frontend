import { Button } from "@chakra-ui/react";

import { VerifyPublishCodeModal } from "lib/components/modal";

interface VerifyButtonProps {
  codeId: number;
  codeHash: string;
  label?: string;
  minW?: string;
}

export const VerifyButton = ({
  codeId,
  codeHash,
  label = "Verify code",
  minW = "96px",
}: VerifyButtonProps) => (
  <VerifyPublishCodeModal
    codeId={codeId}
    codeHash={codeHash}
    triggerElement={
      <Button variant="ghost-primary" size="sm" minW={minW}>
        {label}
      </Button>
    }
  />
);
