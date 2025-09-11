import type { EncodeObject } from "@cosmjs/proto-signing";
import type { Gas, Message, Msg, Option } from "lib/types";

import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { MsgExecute } from "@initia/initia.js";
import { AmpEvent, track } from "lib/amplitude";
import { useFabricateFee, useResendTx } from "lib/app-provider";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeQuery } from "lib/services/tx";
import { camelToSnake, encode } from "lib/utils";
import { useCallback, useState } from "react";

import { CustomIcon } from "../icon";

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
  const [error, setError] = useState<Option<string>>(undefined);

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
    onError: (error) => {
      setError(error.message);
      setIsProcessing(false);
    },
    onSuccess: proceed,
  });

  return (
    <>
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
      {error && (
        <Modal
          closeOnOverlayClick={false}
          isCentered
          isOpen
          onClose={() => setError(undefined)}
        >
          <ModalOverlay />
          <ModalContent w="600px">
            <ModalHeader>
              <Flex alignItems="center" direction="row" gap={3} w="full">
                <CustomIcon
                  boxSize={5}
                  color="error.light"
                  name="alert-triangle-solid"
                />
                <Heading as="h5" variant="h5">
                  Resend transaction failed
                </Heading>
              </Flex>
            </ModalHeader>
            <ModalCloseButton color="gray.600" />
            <ModalBody>{error}</ModalBody>
            <ModalFooter gap={2}>
              <Button
                variant="outline-primary"
                w="120px"
                onClick={() => setError(undefined)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
