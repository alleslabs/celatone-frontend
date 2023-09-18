import { Alert, AlertDescription, Button, Flex } from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { MsgExecute as MsgExecuteModule } from "@initia/initia.js";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useFabricateFee,
  useSimulateFeeQuery,
  useExecuteModuleTx,
  useCurrentChain,
} from "lib/app-provider";
import { AbiForm } from "lib/components/abi";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";
import { getAbiInitialData, serializeAbiData, toEncodeObject } from "lib/utils";

export const ExecuteArea = ({
  moduleAddress,
  moduleName,
  fn,
}: {
  moduleAddress: HexAddr;
  moduleName: string;
  fn: ExposedFunction;
}) => {
  const { address } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const executeModuleTx = useExecuteModuleTx();
  const { broadcast } = useTxBroadcast();

  const [data, setData] = useState<AbiFormData>({
    typeArgs: getAbiInitialData(fn.generic_type_params.length),
    args: getAbiInitialData(fn.params.length),
  });
  const [abiErrors, setAbiErrors] = useState<[string, string][]>([]);

  const [composedTxMsgs, setComposedTxMsgs] = useState<EncodeObject[]>([]);
  const [simulateFeeError, setSimulateFeeError] = useState<string>();
  const [fee, setFee] = useState<StdFee>();
  const [processing, setProcessing] = useState(false);

  const enableExecute = useMemo(
    () => !abiErrors.length && Boolean(address),
    [abiErrors.length, address]
  );

  const { isFetching } = useSimulateFeeQuery({
    enabled: composedTxMsgs.length > 0,
    messages: composedTxMsgs,
    onSuccess: (gasRes) => {
      setSimulateFeeError(undefined);
      if (gasRes) setFee(fabricateFee(gasRes));
      else setFee(undefined);
    },
    onError: (e) => {
      setSimulateFeeError(e.message);
      setFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    const serializedData = serializeAbiData(fn, data);

    const stream = await executeModuleTx({
      moduleAddress,
      moduleName,
      functionName: fn.name,
      typeArgs: serializedData.typeArgs,
      args: serializedData.args,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [broadcast, data, executeModuleTx, fn, moduleAddress, moduleName]);

  useEffect(() => {
    if (enableExecute) {
      const serializedData = serializeAbiData(fn, data);

      const composedMsgs = toEncodeObject([
        new MsgExecuteModule(
          address as string,
          moduleAddress,
          moduleName,
          fn.name,
          serializedData.typeArgs,
          serializedData.args
        ),
      ]);

      const timeoutId = setTimeout(() => {
        setComposedTxMsgs(composedMsgs);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [address, data, enableExecute, fn, moduleAddress, moduleName]);

  return (
    <Flex direction="column">
      <AbiForm
        fn={fn}
        initialData={data}
        propsOnChange={setData}
        propsOnErrors={setAbiErrors}
      />
      {simulateFeeError && (
        <Alert variant="error" mb={3} alignItems="center">
          <AlertDescription wordBreak="break-word">
            {simulateFeeError}
          </AlertDescription>
        </Alert>
      )}
      <Flex alignItems="center" justify="space-between">
        <Button>TODO: CodeSnippet</Button>
        <Flex direction="row" align="center" gap={2}>
          <Flex fontSize="14px" color="text.dark" alignItems="center">
            Transaction Fee:{" "}
            <EstimatedFeeRender estimatedFee={fee} loading={isFetching} />
          </Flex>
          <Button
            variant="primary"
            fontSize="14px"
            p="6px 16px"
            onClick={proceed}
            isDisabled={!enableExecute || !fee || isFetching}
            leftIcon={<CustomIcon name="execute" />}
            isLoading={processing}
            sx={{ pointerEvents: processing && "none" }}
          >
            Execute
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
