import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import { useEffect, useState } from "react";

import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { scrollToTop } from "lib/utils";

import CompletedPage from "./completed";
import InstantiatePage from "./instantiate";

export interface InstantiateTxInfo extends InstantiateResult {
  contractLabel: string;
}

const Index = () => {
  const wasm = useWasmConfig();
  const navigate = useInternalNavigate();
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
    if (!wasm.enabled) navigate({ pathname: "/", replace: true });
  }, [navigate, wasm.enabled]);

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
