import type { Log } from "@cosmjs/stargate/build/logs";
import type { MessageResponse, Option } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import { TxMsgDetails } from "./TxMsgDetails";
import { TxMsgExpand } from "./TxMsgExpand";

export interface TxMsgData {
  compact: boolean;
  log: Option<Log>;
  msgBody: MessageResponse;
  msgCount: number;
}

export const TxMessage = ({ msgCount, ...txMsgData }: TxMsgData) => {
  const [expand, setExpand] = useState(msgCount === 1);
  return (
    <Flex direction="column" w="full">
      <TxMsgExpand
        isExpand={expand}
        msgCount={msgCount}
        onClick={() => setExpand((prev) => !prev)}
        {...txMsgData}
      />
      <TxMsgDetails isExpand={expand} msgCount={msgCount} {...txMsgData} />
    </Flex>
  );
};
