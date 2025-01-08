import type { GridItemProps } from "@chakra-ui/react";
import { Flex, SlideFade } from "@chakra-ui/react";
import { useState } from "react";

import { AccordionStepperItem } from "../AccordionStepperItem";
import { SingleActionMsg } from "lib/components/action-msg/SingleActionMsg";
import { RedoButton, ResendButton } from "lib/components/button";
import type { Message } from "lib/types";
import { extractMsgType } from "lib/utils";

import { TableRow } from "./tableComponents";

interface AccordionTxProps extends RenderButtonProps {
  accordionSpacing?: GridItemProps["pl"];
  allowFurtherAction: boolean;
  isSigner?: boolean;
}

interface RenderButtonProps {
  message: Message;
  msgIndex?: number;
  txHash: string;
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
      gap={3}
      h="40px"
      minH={0}
      pl={accordionSpacing}
      _hover={{ background: "gray.800" }}
      borderBottom="none"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      transition="all 0.25s ease-in-out"
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
