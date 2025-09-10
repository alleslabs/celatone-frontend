import type { EncodeObject } from "@cosmjs/proto-signing";
import type { Gas, Message, Msg, Option } from "lib/types";

import { Button } from "@chakra-ui/react";
import { MsgExecute } from "@initia/initia.js";
import { AmpEvent, track } from "lib/amplitude";
import { useFabricateFee, useResendTx } from "lib/app-provider";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeQuery } from "lib/services/tx";
import { camelToSnake, encode } from "lib/utils";
import { useCallback, useState } from "react";

interface ResendButtonProps {
  messages: Message[];
  msgIndex?: number;
  txHash: string;
}

const formatMsgs = (messages: Message[]) =>
  messages.reduce((acc: EncodeObject[], msg: Message) => {
    // TODO: revisit if detail is undefined
    const detail = msg.detail as Msg;
    // TODO: workaround for msg move execute
    if (msg.type === "/initia.move.v1.MsgExecute") {
      const executeMsg = MsgExecute.fromData(
        camelToSnake(detail) as unknown as MsgExecute.Data
      );
      acc.push({
        typeUrl: msg.type,
        value: executeMsg.toProto(),
      });
      return acc;
    }
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
  msgIndex = 0,
  txHash,
}: ResendButtonProps) => {
  const fabricateFee = useFabricateFee();
  const resendTx = useResendTx();
  const { broadcast } = useTxBroadcast();
  const [count, setCount] = useState(0);

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
        onTxFailed: () => setIsProcessing(false),
        onTxSucceed: () => setIsProcessing(false),
      });
      if (stream) broadcast(stream);
    },
    [broadcast, composedMsgs, fabricateFee, resendTx]
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: isProcessing,
    extraQueryKey: [txHash, msgIndex, count],
    messages: composedMsgs,
    onError: () => setIsProcessing(false),
    onSuccess: proceed,
  });

  return (
    <Button
      iconSpacing="0"
      isDisabled={isProcessing}
      isLoading={isSimulating}
      size="sm"
      variant="outline-gray"
      onClick={(e) => {
        e.stopPropagation();
        setIsProcessing(true);
        setCount((c) => c + 1);
      }}
    >
      Resend
    </Button>
  );
};
