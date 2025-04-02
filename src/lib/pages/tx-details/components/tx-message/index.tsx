import type { Log } from "@cosmjs/stargate/build/logs";
import type { MessageResponse, Option } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import { TxMsgDetails } from "./TxMsgDetails";
import { TxMsgExpand } from "./TxMsgExpand";

export interface TxMsgData {
  msgBody: MessageResponse;
  log: Option<Log>;
  isSingleMsg?: boolean;
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
