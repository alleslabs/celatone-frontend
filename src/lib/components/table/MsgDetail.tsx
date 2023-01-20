import { SlideFade } from "@chakra-ui/react";
import { useState } from "react";

import { SingleActionMsg } from "../action-msg/SingleActionMsg";
import { AccordionStepperItem } from "lib/components/AccordionStepperItem";
import { RedoButton } from "lib/components/button/RedoButton";
import { ResendButton } from "lib/components/button/ResendButton";
import type { Message } from "lib/types";
import { extractMsgType } from "lib/utils";

import { TableRow } from "./tableComponents";

interface MsgDetailProps {
  message: Message;
  allowFurtherAction: boolean;
}

interface RenderButtonProps {
  message: Message;
}

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

export const MsgDetail = ({ message, allowFurtherAction }: MsgDetailProps) => {
  const [showButton, setShowButton] = useState(false);
  return (
    <TableRow
      h="40px"
      borderBottom="none"
      pl="256px"
      gap={3}
      _hover={{ background: "divider.main" }}
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
      />
      {allowFurtherAction && (
        <SlideFade in={showButton} offsetY="20px">
          <RenderButton message={message} />
        </SlideFade>
      )}
    </TableRow>
  );
};
