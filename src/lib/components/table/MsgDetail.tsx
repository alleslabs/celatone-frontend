import { SingleActionMsg } from "../action-msg/SingleActionMsg";
import { AccordionStepperItem } from "lib/components/AccordionStepperItem";
import type { Message } from "lib/types";
import { extractMsgType } from "lib/utils";

import { TableRow } from "./tableComponents";

interface MsgDetailProps {
  message: Message;
}

export const MsgDetail = ({ message }: MsgDetailProps) => (
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
  >
    <AccordionStepperItem />
    <SingleActionMsg
      messages={[message]}
      type={extractMsgType(message.type)}
      success
      singleMsg
    />
  </TableRow>
);
