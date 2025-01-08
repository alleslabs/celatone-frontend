import { useEffect, useState } from "react";

import { useDummyWallet } from "lib/app-provider";
import { useSimulateFeeQuery } from "lib/services/tx";
import type { BechAddr32 } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg } from "lib/utils";

export const useExecuteCmds = (contractAddress: BechAddr32) => {
  const [execCmds, setExecCmds] = useState<[string, string][]>([]);
  const { dummyAddress } = useDummyWallet();

  useEffect(() => {
    if (!contractAddress) setExecCmds([]);
  }, [contractAddress]);

  const { isFetching } = useSimulateFeeQuery({
    enabled: !!contractAddress && !!dummyAddress,
    isDummyUser: true,
    messages: dummyAddress
      ? [
          composeMsg(MsgType.EXECUTE, {
            contract: contractAddress,
            funds: [],
            msg: Buffer.from('{"": {}}'),
            sender: dummyAddress,
          }),
        ]
      : [],
    onError: (e) => {
      const executeCmds: string[] = [];

      // Check if Sylvia framework
      const sylviaRegex =
        /Messages supported by this contract: (.*?): execute wasm contract failed/;
      const contentMatch = e.message?.match(sylviaRegex);

      if (contentMatch && contentMatch[1]) {
        const content = contentMatch[1].split(",");
        content.forEach((each) => executeCmds.push(each.trim()));
      } else if (e.message.includes("Error parsing into type")) {
        Array.from(e.message?.matchAll(/`(.*?)`/g) || [])
          .slice(1)
          .forEach((match) => executeCmds.push(match[1]));
      }

      if (executeCmds.length === 0) {
        setExecCmds([["", "{}"]]);
      } else {
        setExecCmds(executeCmds.map((cmd) => [cmd, `{"${cmd}": {}}`]));
      }
    },
    retry: false,
  });
  return { execCmds, isFetching };
};
