import type { Message, Msg } from "lib/types";

import { Button } from "@chakra-ui/react";
import { useCurrentChain } from "lib/app-provider";
import { useRedo } from "lib/hooks/useRedo";
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
      size="sm"
      variant="outline-gray"
      onClick={(e) =>
        onClickRedo(
          e,
          extractMsgType(message.type),
          message.detail as Msg,
          chainName
        )
      }
    >
      <CustomIcon boxSize={3} name="redo" />
      Redo
    </Button>
  );
};
