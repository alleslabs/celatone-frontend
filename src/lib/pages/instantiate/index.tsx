import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import { useEffect, useState } from "react";

import { useWasmConfig } from "lib/app-provider";
import { scrollToTop } from "lib/utils";

import CompletedPage from "./completed";
import InstantiatePage from "./instantiate";

export interface InstantiateTxInfo extends InstantiateResult {
  contractLabel: string;
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
    gasWanted: 0,
    gasUsed: 0,
    contractLabel: "",
  });

  useEffect(() => {
    scrollToTop();
  }, [completed]);

  return completed && txInfo ? (
    <CompletedPage txInfo={txInfo} />
  ) : (
    <InstantiatePage
      onComplete={(txResult: InstantiateResult, contractLabel: string) => {
        setTxInfo({ ...txResult, contractLabel });
        setCompleted(true);
      }}
    />
  );
};

export default Index;
