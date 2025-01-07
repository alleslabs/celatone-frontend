import { useEffect, useState } from "react";

import type { PublishTxInternalResult } from "lib/app-fns/tx/publish";
import { UpgradePolicy } from "lib/types";
import { scrollToTop } from "lib/utils";

import { PublishCompleted } from "./completed";
import type { Module } from "./formConstants";
import { PublishModule } from "./publish";

const DEFAULT_STATE: PublishCompleteState = {
  modules: [],
  txFee: undefined,
  txHash: "",
  upgradePolicy: UpgradePolicy.UNSPECIFIED,
};
export interface PublishCompleteState extends PublishTxInternalResult {
  modules: Module[];
  upgradePolicy: UpgradePolicy;
}

export const PublishIndex = () => {
  const [publishTxInfo, setPublishTxInfo] =
    useState<PublishCompleteState>(DEFAULT_STATE);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, [completed]);

  return completed ? (
    <PublishCompleted
      resetState={() => {
        setPublishTxInfo(DEFAULT_STATE);
        setCompleted(false);
      }}
      publishTxInfo={publishTxInfo}
    />
  ) : (
    <PublishModule
      setCompleted={setCompleted}
      setPublishTxInfo={setPublishTxInfo}
    />
  );
};
