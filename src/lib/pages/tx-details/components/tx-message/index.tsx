import { Flex } from "@chakra-ui/react";
import type { Log } from "@cosmjs/stargate/build/logs";
import { useState } from "react";

import type { MsgBody } from "lib/services/tx";
import type { Option } from "lib/types";

import { TxMsgDetails } from "./TxMsgDetails";
import { TxMsgExpand } from "./TxMsgExpand";

export interface TxMsgData {
  msgBody: MsgBody;
  log: Option<Log>;
  isSingleMsg?: boolean;
}

export const TxMessage = ({ isSingleMsg, ...txMsgData }: TxMsgData) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  return (
    <Flex direction="column">
      <TxMsgExpand
        isExpand={expand}
        onClick={() => setExpand((prev) => !prev)}
        {...txMsgData}
      />
      <TxMsgDetails isExpand={expand} {...txMsgData} />
    </Flex>
  );
};
