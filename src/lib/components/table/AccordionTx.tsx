import type { GridItemProps } from "@chakra-ui/react";
import type { DecodedMessage } from "@initia/tx-decoder";
import type { TxResponse } from "lib/services/types";
import type { Message } from "lib/types";

import { Flex, SlideFade } from "@chakra-ui/react";
import { SingleActionMsg } from "lib/components/action-msg/SingleActionMsg";
import { RedoButton, ResendButton } from "lib/components/button";
import { extractMsgType } from "lib/utils";
import { useState } from "react";

import { AccordionStepperItem } from "../AccordionStepperItem";
import { DecodeMessage } from "../decode-message";
import { TableRow } from "./tableComponents";

interface RenderButtonProps {
  message: Message;
  msgIndex?: number;
  txHash: string;
}

interface AccordionTxProps extends RenderButtonProps {
  accordionSpacing?: GridItemProps["pl"];
  allowFurtherAction: boolean;
  decodedMessage?: DecodedMessage;
  msgCount: number;
  txResponse?: TxResponse;
}

const RenderButton = ({ message, msgIndex, txHash }: RenderButtonProps) => {
  if (
    extractMsgType(message.type) === "MsgExecuteContract" ||
    extractMsgType(message.type) === "MsgInstantiateContract"
  )
    return <RedoButton message={message} />;

  if (extractMsgType(message.type) === "MsgSend")
    return (
      <ResendButton messages={[message]} msgIndex={msgIndex} txHash={txHash} />
    );

  return null;
};

export const AccordionTx = ({
  accordionSpacing = "280px",
  allowFurtherAction,
  decodedMessage,
  message,
  msgCount,
  msgIndex,
  txHash,
  txResponse,
}: AccordionTxProps) => {
  const [showButton, setShowButton] = useState(false);
  return (
    <TableRow
      className="accordion-stepper-wrapper"
      _hover={{ background: "gray.800" }}
      borderBottom="none"
      gap={6}
      h="40px"
      minH={0}
      overflow="hidden"
      pl={accordionSpacing}
      transition="all 0.25s ease-in-out"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      <AccordionStepperItem />
      <Flex alignItems="center" gap={1}>
        {txResponse && decodedMessage ? (
          <DecodeMessage
            compact
            decodedMessage={decodedMessage}
            log={undefined}
            msgBody={{
              "@type": message.type,
              ...message,
            }}
            msgCount={1}
          />
        ) : (
          <SingleActionMsg
            messages={[message]}
            singleMsg
            success
            type={extractMsgType(message.type)}
          />
        )}
        {allowFurtherAction && msgCount === 1 && (
          <SlideFade in={showButton} offsetY="20px">
            <RenderButton
              message={message}
              msgIndex={msgIndex}
              txHash={txHash}
            />
          </SlideFade>
        )}
      </Flex>
    </TableRow>
  );
};
