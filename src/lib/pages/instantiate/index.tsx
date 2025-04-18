import type { DeliverTxResponse } from "@cosmjs/cosmwasm-stargate";
import type { BechAddr20, BechAddr32 } from "lib/types";

import { useWasmConfig } from "lib/app-provider";
import { scrollToTop } from "lib/utils";
import { useEffect, useState } from "react";

import InstantiateCompleted from "./InstantiateCompleted";
import InstantiateFormPage from "./InstantiateFormPage";

export interface InstantiateTxInfo extends DeliverTxResponse {
  contractLabel: string;
  codeId: number;
  instantiator: BechAddr20;
  contractAddress: BechAddr32;
}

const Instantiate = () => {
  useWasmConfig({ shouldRedirect: true });
  const [completed, setCompleted] = useState(false);
  const [txInfo, setTxInfo] = useState<InstantiateTxInfo>({
    code: 0,
    codeId: 0,
    contractAddress: "" as BechAddr32,
    contractLabel: "",
    events: [],
    gasUsed: BigInt(0),
    gasWanted: BigInt(0),
    height: 0,
    instantiator: "" as BechAddr20,
    msgResponses: [],
    transactionHash: "",
    txIndex: 0,
  });

  useEffect(() => {
    scrollToTop();
  }, [completed]);

  return completed && txInfo ? (
    <InstantiateCompleted txInfo={txInfo} />
  ) : (
    <InstantiateFormPage
      onComplete={(
        txResult: DeliverTxResponse,
        contractLabel: string,
        contractAddress: BechAddr32,
        codeId: number,
        instantiator: BechAddr20
      ) => {
        setTxInfo({
          ...txResult,
          codeId,
          contractAddress,
          contractLabel,
          instantiator,
        });
        setCompleted(true);
      }}
    />
  );
};

export default Instantiate;
