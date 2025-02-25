import type { GridItemProps } from "@chakra-ui/react";
import { Flex, SlideFade } from "@chakra-ui/react";
import { useState } from "react";

import { SingleActionMsg } from "lib/components/action-msg/SingleActionMsg";
import { RedoButton, ResendButton } from "lib/components/button";
import type { Message } from "lib/types";
import { extractMsgType } from "lib/utils";

import { TableRow } from "./tableComponents";
import { AccordionStepperItem } from "../AccordionStepperItem";

interface RenderButtonProps {
  message: Message;
  txHash: string;
  msgIndex?: number;
}

interface AccordionTxProps extends RenderButtonProps {
  allowFurtherAction: boolean;
  isSigner?: boolean;
  accordionSpacing?: GridItemProps["pl"];
}

const RenderButton = ({ message, txHash, msgIndex }: RenderButtonProps) => {
  if (
    extractMsgType(message.type) === "MsgExecuteContract" ||
    extractMsgType(message.type) === "MsgInstantiateContract"
  )
    return <RedoButton message={message} />;

  if (extractMsgType(message.type) === "MsgSend")
    return (
      <ResendButton messages={[message]} txHash={txHash} msgIndex={msgIndex} />
    );

  return null;
};

export const AccordionTx = ({
  message,
  txHash,
  msgIndex,
  allowFurtherAction,
  isSigner = false,
  accordionSpacing = "260px",
}: AccordionTxProps) => {
  const [showButton, setShowButton] = useState(false);
  return (
    <TableRow
      className="accordion-stepper-wrapper"
      minH={0}
      h="40px"
      borderBottom="none"
      pl={accordionSpacing}
      gap={3}
      _hover={{ background: "gray.800" }}
      transition="all 0.25s ease-in-out"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      <AccordionStepperItem />
      <Flex gap={1} alignItems="center">
        <SingleActionMsg
          messages={[message]}
          type={extractMsgType(message.type)}
          success
          singleMsg
        />
        {allowFurtherAction && isSigner && (
          <SlideFade in={showButton} offsetY="20px">
            <RenderButton
              message={message}
              txHash={txHash}
              msgIndex={msgIndex}
            />
          </SlideFade>
        )}
      </Flex>
    </TableRow>
  );
};
