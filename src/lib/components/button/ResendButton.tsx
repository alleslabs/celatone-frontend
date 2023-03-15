import { Button } from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import { useCallback, useState } from "react";

import { useFabricateFee, useResendTx, useSimulateFee } from "lib/app-provider";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Message } from "lib/types";
import { camelToSnake, encode } from "lib/utils";

interface ResendButtonProps {
  messages: Message[];
}

const formatMsgs = (messages: Message[]) =>
  messages.reduce((acc: EncodeObject[], msg: Message) => {
    acc.push({
      typeUrl: msg.type,
      value: !msg.msg.msg
        ? msg.msg
        : {
            ...msg.msg,
            msg: encode(JSON.stringify(camelToSnake(msg.msg.msg))),
          },
    });
    return acc;
  }, []);

export const ResendButton = ({ messages }: ResendButtonProps) => {
  const fabricateFee = useFabricateFee();
  const { simulate } = useSimulateFee();
  const resendTx = useResendTx();
  const { broadcast } = useTxBroadcast();

  const [isProcessing, setIsProcessing] = useState(false);

  const proceed = useCallback(async () => {
    AmpTrack(AmpEvent.ACTION_RESEND);
    const formatedMsgs = formatMsgs(messages);
    const estimatedGasUsed = await simulate(formatedMsgs);

    const stream = await resendTx({
      onTxSucceed: () => setIsProcessing(false),
      onTxFailed: () => setIsProcessing(false),
      estimatedFee: estimatedGasUsed
        ? fabricateFee(estimatedGasUsed)
        : undefined,
      messages: formatedMsgs,
    });
    if (stream) broadcast(stream);
  }, [broadcast, fabricateFee, messages, resendTx, simulate]);

  return (
    <Button
      variant="outline"
      iconSpacing="0"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        setIsProcessing(true);
        proceed();
      }}
      isDisabled={isProcessing}
    >
      Resend
    </Button>
  );
};
