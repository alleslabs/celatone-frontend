import { SlideFade } from "@chakra-ui/react";
import { useState } from "react";

import { AccordionStepperItem } from "../AccordionStepperItem";
import { SingleActionMsg } from "lib/components/action-msg/SingleActionMsg";
import { RedoButton, ResendButton } from "lib/components/button";
import type { Message } from "lib/types";
import { extractMsgType } from "lib/utils";

import { TableRow } from "./tableComponents";

interface AccordionTxProps {
  message: Message;
  allowFurtherAction: boolean;
}

interface RenderButtonProps {
  message: Message;
}

const ACCORDION_LEFT_SPACING = "266px";

const RenderButton = ({ message }: RenderButtonProps) => {
  if (
    extractMsgType(message.type) === "MsgExecuteContract" ||
    extractMsgType(message.type) === "MsgInstantiateContract"
  )
    return <RedoButton message={message} />;

  if (extractMsgType(message.type) === "MsgSend")
    return <ResendButton messages={[message]} />;

  return null;
};

export const AccordionTx = ({
  message,
  allowFurtherAction,
}: AccordionTxProps) => {
  const [showButton, setShowButton] = useState(false);
  return (
    <TableRow
      h="40px"
      borderBottom="none"
      pl={ACCORDION_LEFT_SPACING}
      gap={3}
      _hover={{ background: "pebble.800" }}
      transition="all .25s ease-in-out"
      css={{
        "&:not(:first-of-type) div#before-stepper": {
          visibility: "visible",
        },
      }}
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      <AccordionStepperItem />
      <SingleActionMsg
        messages={[message]}
        type={extractMsgType(message.type)}
        success
        singleMsg
        showCopyButton={false}
      />
      {allowFurtherAction && (
        <SlideFade in={showButton} offsetY="20px">
          <RenderButton message={message} />
        </SlideFade>
      )}
    </TableRow>
  );
};
