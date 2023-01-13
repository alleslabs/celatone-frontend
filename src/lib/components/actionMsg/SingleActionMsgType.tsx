import { useSingleActionMsgTemplate } from "lib/hooks/useSingleMessageTemplate";
import { SingleMsg } from "lib/pages/past-txs/components/SingleMsg";
import type { Message } from "lib/types";

interface SingleActionMsgTypeProps {
  messages: Message[];
  type: string;
  success: boolean;
  singleMsg?: boolean;
}
export const SingleActionMsgType = ({
  messages,
  type,
  success,
  singleMsg,
}: SingleActionMsgTypeProps) => {
  const singleMsgProps = useSingleActionMsgTemplate(
    type,
    success,
    messages,
    singleMsg
  );
  return <SingleMsg {...singleMsgProps} />;
};
