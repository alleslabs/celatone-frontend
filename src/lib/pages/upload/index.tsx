import type { StoreCodeTxInternalResult } from "lib/app-fns/tx/storeCode";

import { useWasmConfig } from "lib/app-provider";
import { scrollToTop } from "lib/utils";
import { useState } from "react";

import { UploadComplete } from "./completed";
import { Upload } from "./upload";

const UploadIndex = () => {
  useWasmConfig({ shouldRedirect: true });
  const [txInfo, setTxInfo] = useState<StoreCodeTxInternalResult>({
    codeDisplayName: "",
    codeHash: "",
    codeId: "",
    txFee: undefined,
    txHash: "",
  });

  const [completed, setCompleted] = useState(false);

  return completed ? (
    <UploadComplete txResult={txInfo} />
  ) : (
    <Upload
      onComplete={(txResult) => {
        setTxInfo(txResult);
        setCompleted(true);
        scrollToTop();
      }}
    />
  );
};

export default UploadIndex;
