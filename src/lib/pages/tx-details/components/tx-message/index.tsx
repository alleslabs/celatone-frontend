import { Flex } from "@chakra-ui/react";
import type { Log } from "@cosmjs/stargate/build/logs";
import { useState } from "react";

import type { MessageResponse, Option } from "lib/types";

import { TxMsgDetails } from "./TxMsgDetails";
import { TxMsgExpand } from "./TxMsgExpand";

export interface TxMsgData {
  isSingleMsg?: boolean;
  log: Option<Log>;
  msgBody: MessageResponse;
}

export const TxMessage = ({ isSingleMsg, ...txMsgData }: TxMsgData) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  return (
    <Flex direction="column">
      <TxMsgExpand
        isExpand={expand}
        isSingleMsg={isSingleMsg}
        onClick={() => setExpand((prev) => !prev)}
        {...txMsgData}
      />
      <TxMsgDetails isExpand={expand} {...txMsgData} />
    </Flex>
  );
};
