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

export default Instantiate;
