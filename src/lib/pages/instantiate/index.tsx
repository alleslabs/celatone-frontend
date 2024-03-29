import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import { useEffect, useState } from "react";

import { useWasmConfig } from "lib/app-provider";
import type { BechAddr20 } from "lib/types";
import { scrollToTop } from "lib/utils";

import CompletedPage from "./completed";
import InstantiatePage from "./instantiate";

export interface InstantiateTxInfo extends InstantiateResult {
  contractLabel: string;
  instantiator: BechAddr20;
}

const Index = () => {
  useWasmConfig({ shouldRedirect: true });
  const [completed, setCompleted] = useState(false);
  const [txInfo, setTxInfo] = useState<InstantiateTxInfo>({
    contractAddress: "",
    logs: [],
    height: 0,
    transactionHash: "",
    events: [],
    gasWanted: BigInt(0),
    gasUsed: BigInt(0),
    contractLabel: "",
    instantiator: "" as BechAddr20,
  });

  useEffect(() => {
    scrollToTop();
  }, [completed]);

  return completed && txInfo ? (
    <CompletedPage txInfo={txInfo} />
  ) : (
    <InstantiatePage
      onComplete={(
        txResult: InstantiateResult,
        contractLabel: string,
        instantiator: BechAddr20
      ) => {
        setTxInfo({ ...txResult, contractLabel, instantiator });
        setCompleted(true);
      }}
    />
  );
};

export default Index;
