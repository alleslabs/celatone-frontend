import type { EncodeObject } from "@cosmjs/proto-signing";
import { useCallback } from "react";

import { useFabricateFee, useResendTx, useSimulateFee } from "lib/app-provider";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Message } from "lib/types";
import { camelToSnake, encode } from "lib/utils";

export const useResend = () => {
  const fabricateFee = useFabricateFee();
  const { simulate } = useSimulateFee();
  const resendTx = useResendTx();
  const { broadcast } = useTxBroadcast();

  return useCallback(
    (
      e: React.MouseEvent<Element, MouseEvent>,
      messages: Message[],
      setIsButtonLoading: (isButtonLoading: boolean) => void,
      setError: (err: string) => void
    ) => {
      (async () => {
        AmpTrack(AmpEvent.ACTION_RESEND);
        e.stopPropagation();
        setIsButtonLoading(true);
        const formatedMsgs = messages.reduce(
          (acc: EncodeObject[], msg: Message) => {
            if (msg.msg.msg) {
              acc.push({
                typeUrl: msg.type,
                value: {
                  ...msg.msg,
                  msg: encode(JSON.stringify(camelToSnake(msg.msg.msg))),
                },
              });
            } else {
              acc.push({
                typeUrl: msg.type,
                value: {
                  ...msg.msg,
                },
              });
            }
            return acc;
          },
          []
        );

        try {
          const estimatedGasUsed = await simulate(formatedMsgs);
          let fee;
          if (estimatedGasUsed) {
            fee = fabricateFee(estimatedGasUsed);
          }
          const stream = await resendTx({
            onTxSucceed: () => {},
            estimatedFee: fee,
            messages: formatedMsgs,
          });
          if (stream) broadcast(stream);
          setIsButtonLoading(false);
        } catch (err) {
          setError((err as Error).message);
          setIsButtonLoading(false);
        }

        return null;
      })();
    },
    [broadcast, fabricateFee, resendTx, simulate]
  );
};
