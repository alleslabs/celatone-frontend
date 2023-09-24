import { useState } from "react";

import type { PublishTxInternalResult } from "lib/app-provider/tx/publish";
import { UpgradePolicy } from "lib/types";

import { PublishCompleted } from "./completed";
import type { FileArrayFields } from "./formConstants";
import { PublishModule } from "./publish";

export interface PublishCompleteState extends PublishTxInternalResult {
  upgradePolicy: UpgradePolicy;
  modules: FileArrayFields;
}

export const PublishIndex = () => {
  const [publishTxInfo, setPublishTxInfo] = useState<PublishCompleteState>({
    txHash: "",
    formattedFee: "",
    upgradePolicy: UpgradePolicy.ARBITRARY,
    modules: [],
  });
  const [completed, setCompleted] = useState(false);

  return completed ? (
    <PublishCompleted {...publishTxInfo} />
  ) : (
    <PublishModule
      setCompleted={setCompleted}
      setPublishTxInfo={setPublishTxInfo}
    />
  );
};
