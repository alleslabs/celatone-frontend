import { Flex } from "@chakra-ui/react";
import type { Log } from "@cosmjs/stargate/build/logs";
import { useState } from "react";

import type { TxValueMsg } from "lib/services/tx";
import type { Option } from "lib/types";

import { TxMsgDetails } from "./TxMsgDetails";
import { TxMsgExpand } from "./TxMsgExpand";

export interface TxMsgData extends TxValueMsg {
  log: Option<Log>;
}

export const TxMessage = ({ ...txMsgData }: TxMsgData) => {
  const [expand, setExpand] = useState(false);
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
