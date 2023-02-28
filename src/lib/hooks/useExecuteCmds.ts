import { useEffect, useState } from "react";

import { useSimulateFeeQuery, useDummyWallet } from "lib/app-provider";
import type { HumanAddr, ContractAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg } from "lib/utils";

export const useExecuteCmds = (contractAddress: ContractAddr) => {
  const [execCmds, setExecCmds] = useState<[string, string][]>([]);
  const { dummyAddress } = useDummyWallet();

  useEffect(() => {
    if (!contractAddress) setExecCmds([]);
  }, [contractAddress]);

  const { isFetching } = useSimulateFeeQuery({
    isDummyUser: true,
    enabled: !!contractAddress && !!dummyAddress,
    messages: [
      composeMsg(MsgType.EXECUTE, {
        sender: dummyAddress as HumanAddr,
        contract: contractAddress as ContractAddr,
        msg: Buffer.from('{"": {}}'),
        funds: [],
      }),
    ],
    onError: (e) => {
      if (e.message.includes("contract: ")) {
        setExecCmds([]);
      } else {
        const executeCmds: string[] = [];
        Array.from(e.message?.matchAll(/`(.*?)`/g) || [])
          .slice(1)
          .forEach((match) => executeCmds.push(match[1]));
        setExecCmds(executeCmds.map((cmd) => [cmd, `{"${cmd}": {}}`]));
      }
    },
  });
  return { isFetching, execCmds };
};
