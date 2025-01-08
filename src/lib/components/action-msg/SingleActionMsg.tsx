import { observer } from "mobx-react-lite";

import { useSingleActionMsgProps } from "lib/hooks/useSingleMessageProps";
import type { Message } from "lib/types";

import { SingleMsg } from "./SingleMsg";

interface SingleActionMsgProps {
  messages: Message[];
  singleMsg?: boolean;
  success: boolean;
  type: string;
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
