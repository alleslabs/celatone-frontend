import type { EncodeObject } from "@cosmjs/proto-signing";
import { useCallback } from "react";

import { useFabricateFee, useResendTx, useSimulateFee } from "lib/app-provider";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
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
      messagesList: Message[],
      setIsButtonLoading: (isButtonLoading: boolean) => void,
      setError: (err: string) => void
    ) => {
      (async () => {
        e.stopPropagation();
        setIsButtonLoading(true);
        const messages = [] as EncodeObject[];
        messagesList.forEach((msg) => {
          if (msg.msg.msg) {
            messages.push({
              typeUrl: msg.type,
              value: {
                ...msg.msg,
                msg: encode(JSON.stringify(camelToSnake(msg.msg.msg))),
              },
            });
          } else {
            messages.push({
              typeUrl: msg.type,
              value: {
                ...msg.msg,
              },
            });
          }
        });
        try {
          const estimatedGasUsed = await simulate(messages);
          let fee;
          if (estimatedGasUsed) {
            fee = fabricateFee(estimatedGasUsed);
          }
          const stream = await resendTx({
            onTxSucceed: () => {},
            estimatedFee: fee,
            messages,
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
