import { useSingleActionMsgProps } from "lib/hooks/useSingleMessageProps";
import type { Message } from "lib/types";

import { SingleMsg } from "./SingleMsg";

interface SingleActionMsgProps {
  messages: Message[];
  type: string;
  success: boolean;
  singleMsg?: boolean;
}
export const SingleActionMsg = ({
  messages,
  type,
  success,
  singleMsg,
}: SingleActionMsgProps) => {
  const singleMsgProps = useSingleActionMsgProps(
    type,
    success,
    messages,
    singleMsg
  );
  return <SingleMsg {...singleMsgProps} />;
};
