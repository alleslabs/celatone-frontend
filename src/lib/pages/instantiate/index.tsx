import type { DeliverTxResponse } from "@cosmjs/cosmwasm-stargate";
import { useEffect, useState } from "react";

import { useWasmConfig } from "lib/app-provider";
import type { BechAddr20, BechAddr32 } from "lib/types";
import { scrollToTop } from "lib/utils";

import CompletedPage from "./completed";
import InstantiatePage from "./instantiate";

export interface InstantiateTxInfo extends DeliverTxResponse {
  contractLabel: string;
  codeId: number;
  instantiator: BechAddr20;
  contractAddress: BechAddr32;
}

const Index = () => {
  useWasmConfig({ shouldRedirect: true });
  const [completed, setCompleted] = useState(false);
  const [txInfo, setTxInfo] = useState<InstantiateTxInfo>({
    contractAddress: "" as BechAddr32,
    height: 0,
    transactionHash: "",
    events: [],
    gasWanted: BigInt(0),
    gasUsed: BigInt(0),
    contractLabel: "",
    codeId: 0,
    instantiator: "" as BechAddr20,
    txIndex: 0,
    code: 0,
    msgResponses: [],
  });

  useEffect(() => {
    scrollToTop();
  }, [completed]);

  return completed && txInfo ? (
    <CompletedPage txInfo={txInfo} />
  ) : (
    <InstantiatePage
      onComplete={(
        txResult: DeliverTxResponse,
        contractLabel: string,
        contractAddress: BechAddr32,
        codeId: number,
        instantiator: BechAddr20
      ) => {
        setTxInfo({
          ...txResult,
          contractAddress,
          contractLabel,
          codeId,
          instantiator,
        });
        setCompleted(true);
      }}
    />
  );
};

export default Index;
