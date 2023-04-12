import { Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { CustomIcon } from "../icon";
import { useRedo } from "lib/hooks/useRedo";
import type { Message, Msg } from "lib/types";
import { extractMsgType } from "lib/utils";

interface RedoButtonProps {
  message: Message;
}

export const RedoButton = ({ message }: RedoButtonProps) => {
  const onClickRedo = useRedo();
  const { currentChainName } = useWallet();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) =>
        onClickRedo(
          e,
          extractMsgType(message.type),
          message.detail as Msg,
          currentChainName
        )
      }
    >
      <CustomIcon name="redo" boxSize="3" />
      Redo
    </Button>
  );
};
