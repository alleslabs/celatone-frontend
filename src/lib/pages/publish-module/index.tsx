import { useEffect, useState } from "react";

import type { PublishTxInternalResult } from "lib/app-fns/tx/publish";
import { UpgradePolicy } from "lib/types";
import { scrollToTop } from "lib/utils";

import { PublishCompleted } from "./completed";
import type { Module } from "./formConstants";
import { PublishModule } from "./publish";

export interface PublishCompleteState extends PublishTxInternalResult {
  upgradePolicy: UpgradePolicy;
  modules: Module[];
}

const DEFAULT_STATE: PublishCompleteState = {
  txHash: "",
  txFee: undefined,
  upgradePolicy: UpgradePolicy.UNSPECIFIED,
  modules: [],
};

export const PublishIndex = () => {
  const [publishTxInfo, setPublishTxInfo] =
    useState<PublishCompleteState>(DEFAULT_STATE);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, [completed]);

  return completed ? (
    <PublishCompleted
      publishTxInfo={publishTxInfo}
      resetState={() => {
        setPublishTxInfo(DEFAULT_STATE);
        setCompleted(false);
      }}
    />
  ) : (
    <PublishModule
      setCompleted={setCompleted}
      setPublishTxInfo={setPublishTxInfo}
    />
  );
};
