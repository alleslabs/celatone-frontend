import { useSingleActionMsgProps } from "lib/hooks/useSingleMessageProps";
import type { Message } from "lib/types";

import { SingleMsg } from "./SingleMsg";

interface SingleActionMsgProps {
  messages: Message[];
  type: string;
  success: boolean;
  singleMsg?: boolean;
  showCopyButton: boolean;
}
export const SingleActionMsg = ({
  messages,
  type,
  success,
  singleMsg,
  showCopyButton,
}: SingleActionMsgProps) => {
  const singleMsgProps = useSingleActionMsgProps(
    type,
    success,
    messages,
    singleMsg
  );
  return <SingleMsg {...singleMsgProps} showCopyButton={showCopyButton} />;
};
