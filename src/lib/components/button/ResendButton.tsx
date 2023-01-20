import { Button } from "@chakra-ui/react";
import { useState } from "react";

import { FailedModal } from "lib/pages/instantiate/component";
import { useResend } from "lib/pages/past-txs/hooks/useResend";
import type { Message } from "lib/types";

interface ResendButtonProps {
  messages: Message[];
}
export const ResendButton = ({ messages }: ResendButtonProps) => {
  const onClickResend = useResend();
  const [error, setError] = useState("");

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        iconSpacing="0"
        size="sm"
        onClick={(e) =>
          onClickResend(e, messages, setIsButtonLoading, setError)
        }
        isDisabled={isButtonLoading}
      >
        Resend
      </Button>
      {error && <FailedModal errorLog={error} onClose={() => setError("")} />}
    </>
  );
};
