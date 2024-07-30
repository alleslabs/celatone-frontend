import { Button } from "@chakra-ui/react";

import { VerifyPublishCodeModal } from "lib/components/modal";

export const VerifyButton = ({
  codeId,
  codeHash,
  label = "Verify code",
  minW = "96px",
}: {
  codeId: string;
  codeHash: string;
  label?: string;
  minW?: string;
}) => (
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
