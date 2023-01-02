import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";

import { useSimulateFeeQuery } from "../queries";
import { useDummyWallet } from "lib/hooks";
import type { HumanAddr, ContractAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg } from "lib/utils";

interface UseExecuteCmdsProps {
  contractAddress: string;
}

export const useExecuteCmds = ({ contractAddress }: UseExecuteCmdsProps) => {
  const [execCmds, setExecCmds] = useState<[string, string][]>([]);
  const { address } = useWallet();
  const { dummyAddress } = useDummyWallet();

  const userAddress = address || dummyAddress;

  const { isFetching } = useSimulateFeeQuery({
    enabled: !!contractAddress && !!userAddress,
    messages: [
      composeMsg(MsgType.EXECUTE, {
        sender: (address || dummyAddress) as HumanAddr,
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
