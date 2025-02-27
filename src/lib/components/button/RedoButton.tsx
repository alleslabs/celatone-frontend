import { Button } from "@chakra-ui/react";

import { useCurrentChain } from "lib/app-provider";
import { useRedo } from "lib/hooks/useRedo";
import type { Message, Msg } from "lib/types";
import { extractMsgType } from "lib/utils";
import { CustomIcon } from "../icon";

interface RedoButtonProps {
  message: Message;
}

export const RedoButton = ({ message }: RedoButtonProps) => {
  const onClickRedo = useRedo();
  const { chainName } = useCurrentChain();
  return (
    <Button
      variant="outline-gray"
      size="sm"
      onClick={(e) =>
        onClickRedo(
          e,
          extractMsgType(message.type),
          message.detail as Msg,
          chainName
        )
      }
    >
      <CustomIcon name="redo" boxSize={3} />
      Redo
    </Button>
  );
};
