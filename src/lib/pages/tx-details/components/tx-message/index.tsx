import { Flex } from "@chakra-ui/react";
import type { logs } from "@cosmjs/stargate";
import { useState } from "react";

import type { MsgBody } from "lib/services/tx";

import { TxMsgDetails } from "./TxMsgDetails";
import { TxMsgExpand } from "./TxMsgExpand";

export interface TxMsgData {
  msgBody: MsgBody;
  log: logs.Log;
  isSingleMsg?: boolean;
}

export const TxMessage = ({ isSingleMsg, ...txMsgData }: TxMsgData) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  return (
    <Flex direction="column">
      <TxMsgExpand
        isExpand={expand}
        onClick={() => setExpand((prev) => !prev)}
        isSingleMsg={isSingleMsg}
        {...txMsgData}
      />
      <TxMsgDetails isExpand={expand} {...txMsgData} />
    </Flex>
  );
};
