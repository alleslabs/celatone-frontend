import { useState } from "react";

import type { UploadTxInternalResult } from "lib/app-provider";
import { useWasmConfig } from "lib/app-provider";

import { UploadComplete } from "./completed";
import { Upload } from "./upload";

const UploadIndex = () => {
  useWasmConfig({ shouldRedirect: true });
  const [txInfo, setTxInfo] = useState<UploadTxInternalResult>({
    codeDisplayName: "",
    codeId: "",
    txHash: "",
    formattedFee: "",
  });

  const [completed, setCompleted] = useState(false);

  return completed ? (
    <UploadComplete txResult={txInfo} />
  ) : (
    <Upload
      onComplete={(txResult: UploadTxInternalResult) => {
        setTxInfo(txResult);
        setCompleted(true);
      }}
    />
  );
};

export default UploadIndex;
