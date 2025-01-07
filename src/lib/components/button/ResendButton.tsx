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
  txHash: string;
  msgIndex?: number;
}

const formatMsgs = (messages: Message[]) =>
  messages.reduce((acc: EncodeObject[], msg: Message) => {
    // TODO: revisit if detail is undefined
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

export const ResendButton = ({
  messages,
  txHash,
  msgIndex = 0,
}: ResendButtonProps) => {
  const fabricateFee = useFabricateFee();
  const resendTx = useResendTx();
  const { broadcast } = useTxBroadcast();

  const [isProcessing, setIsProcessing] = useState(false);
  const composedMsgs = formatMsgs(messages);

  const proceed = useCallback(
    async (estimatedGasUsed: Option<Gas>) => {
      track(AmpEvent.ACTION_RESEND);
      const stream = await resendTx({
        estimatedFee: estimatedGasUsed
          ? fabricateFee(estimatedGasUsed)
          : undefined,
        messages: composedMsgs,
        onTxSucceed: () => setIsProcessing(false),
        onTxFailed: () => setIsProcessing(false),
      });
      if (stream) broadcast(stream);
    },
    [broadcast, composedMsgs, fabricateFee, resendTx]
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: isProcessing,
    messages: composedMsgs,
    extraQueryKey: [txHash, msgIndex],
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
