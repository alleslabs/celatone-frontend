import type { Message } from "lib/types";

import { useSingleActionMsgProps } from "lib/hooks/useSingleMessageProps";
import { observer } from "mobx-react-lite";

import { SingleMsg } from "./SingleMsg";

interface SingleActionMsgProps {
  messages: Message[];
  type: string;
  success: boolean;
  singleMsg?: boolean;
}
export const SingleActionMsg = observer(
  ({ messages, singleMsg, success, type }: SingleActionMsgProps) => {
    const singleMsgProps = useSingleActionMsgProps(
      type,
      success,
      messages,
      singleMsg
    );
    return <SingleMsg {...singleMsgProps} />;
  }
);
