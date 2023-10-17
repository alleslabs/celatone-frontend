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
    retry: false,
    onError: (e) => {
      // Check if Sylvia framework
      const sylviaRegex =
        /Messages supported by this contract: (.*?): execute wasm contract failed: invalid request/;
      const contentMatch = e.message?.match(sylviaRegex);
      const executeCmds: string[] = [];

      if (contentMatch && contentMatch[1]) {
        const content = contentMatch[1].split(",");
        content.forEach((each) => executeCmds.push(each.trim()));
        setExecCmds(executeCmds.map((cmd) => [cmd, `{"${cmd}": {}}`]));
      } else if (e.message.includes("Error parsing into type")) {
        Array.from(e.message?.matchAll(/`(.*?)`/g) || [])
          .slice(1)
          .forEach((match) => executeCmds.push(match[1]));
        setExecCmds(executeCmds.map((cmd) => [cmd, `{"${cmd}": {}}`]));
      } else {
        setExecCmds([["", "{}"]]);
      }
    },
  });
  return { isFetching, execCmds };
};
