import { useWallet } from "@cosmos-kit/react";
import router from "next/router";
import { useEffect, useState } from "react";

import { useSimulateFeeQuery } from "lib/app-provider";
import { useDummyWallet } from "lib/hooks";
import type { HumanAddr, ContractAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, getFirstQueryParam } from "lib/utils";

interface UseExecuteCmdsProps {
  contractAddress: string;
}
export const useExecuteCmds = ({ contractAddress }: UseExecuteCmdsProps) => {
  const [isEmptyContractAddress, setIsEmptyContractAddress] =
    useState<boolean>(false);
  const [execCmds, setExecCmds] = useState<[string, string][]>([]);
  const { address } = useWallet();
  const { dummyAddress } = useDummyWallet();
  const contractAddr = getFirstQueryParam(router.query.contract);

  useEffect(() => {
    if (!contractAddr) setExecCmds([]);
  }, [contractAddr]);

  // TODO - Refactor - use useSimulateFee
  const { isFetching } = useSimulateFeeQuery({
    enabled: !!contractAddress,
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
        setIsEmptyContractAddress(true);
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
  return { isFetching, isEmptyContractAddress, execCmds };
};
