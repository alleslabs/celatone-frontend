import { Button } from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import { useCallback, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useFabricateFee,
  useResendTx,
  useSimulateFeeQuery,
} from "lib/app-provider";
import { useTxBroadcast } from "lib/hooks";
import type { Gas, Message, Msg, Option } from "lib/types";
import { camelToSnake, encode } from "lib/utils";

interface ResendButtonProps {
  messages: Message[];
}

const formatMsgs = (messages: Message[]) =>
  messages.reduce((acc: EncodeObject[], msg: Message) => {
    const detail = msg.detail as Msg;
    acc.push({
      typeUrl: msg.type,
      value: !detail.msg
        ? detail
        : {
            ...detail,
            msg: encode(JSON.stringify(camelToSnake(detail.msg))),
          },
    });
    return acc;
  }, []);

export const ResendButton = ({ messages }: ResendButtonProps) => {
  const fabricateFee = useFabricateFee();
  const resendTx = useResendTx();
  const { broadcast } = useTxBroadcast();

  const [isProcessing, setIsProcessing] = useState(false);
  const composedMsgs = formatMsgs(messages);

  const proceed = useCallback(
    async (estimatedGasUsed: Option<Gas<number>>) => {
      track(AmpEvent.ACTION_RESEND);
      const stream = await resendTx({
        onTxSucceed: () => setIsProcessing(false),
        onTxFailed: () => setIsProcessing(false),
        estimatedFee: estimatedGasUsed
          ? fabricateFee(estimatedGasUsed)
          : undefined,
        messages: composedMsgs,
      });
      if (stream) broadcast(stream);
    },
    [broadcast, composedMsgs, fabricateFee, resendTx]
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: isProcessing,
    messages: composedMsgs,
    onSuccess: proceed,
    onError: () => setIsProcessing(false),
  });

  return (
    <Button
      variant="outline-gray"
      iconSpacing="0"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        setIsProcessing(true);
      }}
      isLoading={isSimulating}
      isDisabled={isProcessing}
    >
      Resend
    </Button>
  );
};
