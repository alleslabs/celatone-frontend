import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { useModuleByAddressRest } from "lib/services/move/module";
import { zAddr } from "lib/types";
import { decodeArgs, getFilteredParams } from "lib/utils";
import { useMemo } from "react";

interface MoveExecuteArgsReceiptProps {
  displayMode: string | undefined;
  functionName: string;
  moduleAddress: string;
  moduleName: string;
  rawArgs: string[];
}

export const MoveExecuteArgsReceipt = ({
  displayMode,
  functionName,
  moduleAddress,
  moduleName,
  rawArgs,
}: MoveExecuteArgsReceiptProps) => {
  const parsedAddr = zAddr.safeParse(moduleAddress);
  const { data } = useModuleByAddressRest({
    address: parsedAddr.success ? parsedAddr.data : undefined,
    moduleName,
    options: { enabled: parsedAddr.success && !!moduleName },
  });

  const fn = useMemo(
    () =>
      [...(data?.executeFunctions ?? []), ...(data?.viewFunctions ?? [])].find(
        (func) => func.name === functionName
      ),
    [data, functionName]
  );

  const allParams = fn?.params ?? [];
  const params = getFilteredParams(allParams);

  const displayArgs = useMemo(
    () =>
      decodeArgs({
        params,
        rawArgs,
        shouldDecode: displayMode === "decoded",
      }),
    [params, rawArgs, displayMode]
  );

  return (
    <JsonReadOnly
      amptrackSection="tx_page_msg_receipts"
      canCopy
      fullWidth
      isExpandable
      text={JSON.stringify(displayArgs, null, 2)}
    />
  );
};
