import { Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { BsArrowCounterclockwise } from "react-icons/bs";

import { useRedo } from "lib/hooks/useRedo";
import type { Message } from "lib/types";
import { extractMsgType } from "lib/utils";

interface RedoButtonProps {
  message: Message;
}

export const RedoButton = ({ message }: RedoButtonProps) => {
  const onClickRedo = useRedo();
  const { currentChainName } = useWallet();

  return (
    <Button
      leftIcon={<BsArrowCounterclockwise />}
      variant="outline"
      iconSpacing="2"
      size="sm"
      onClick={(e) =>
        onClickRedo(
          e,
          extractMsgType(message.type),
          message.msg,
          currentChainName
        )
      }
    >
      Redo
    </Button>
  );
};
