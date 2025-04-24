import type { GridItemProps } from "@chakra-ui/react";
import type { Message } from "lib/types";

import { Flex, SlideFade } from "@chakra-ui/react";
import { SingleActionMsg } from "lib/components/action-msg/SingleActionMsg";
import { RedoButton, ResendButton } from "lib/components/button";
import { extractMsgType } from "lib/utils";
import { useState } from "react";

import { AccordionStepperItem } from "../AccordionStepperItem";
import { TableRow } from "./tableComponents";

interface RenderButtonProps {
  message: Message;
  msgIndex?: number;
  txHash: string;
}

interface AccordionTxProps extends RenderButtonProps {
  accordionSpacing?: GridItemProps["pl"];
  allowFurtherAction: boolean;
  isSigner?: boolean;
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
  accordionSpacing = "260px",
  allowFurtherAction,
  isSigner = false,
  message,
  msgIndex,
  txHash,
}: AccordionTxProps) => {
  const [showButton, setShowButton] = useState(false);
  return (
    <TableRow
      className="accordion-stepper-wrapper"
      _hover={{ background: "gray.800" }}
      borderBottom="none"
      gap={3}
      h="40px"
      minH={0}
      pl={accordionSpacing}
      transition="all 0.25s ease-in-out"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      <AccordionStepperItem />
      <Flex alignItems="center" gap={1}>
        <SingleActionMsg
          messages={[message]}
          singleMsg
          success
          type={extractMsgType(message.type)}
        />
        {allowFurtherAction && isSigner && (
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
