import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";

import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import { MsgExecute as MsgExecuteModule } from "@initia/initia.js";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCurrentChain,
  useExecuteModuleTx,
  useFabricateFee,
} from "lib/app-provider";
import { SubmitButton } from "lib/components/button";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import { AbiForm } from "lib/components/move-abi";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeQuery } from "lib/services/tx";
import { getAbiInitialData, serializeAbiData, toEncodeObject } from "lib/utils";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const MoveCodeSnippet = dynamic(
  () => import("lib/components/modal/MoveCodeSnippet"),
  {
    ssr: false,
  }
);

export const ExecuteArea = ({
  fn,
  moduleAddress,
  moduleName,
}: {
  moduleAddress: HexAddr;
  moduleName: string;
  fn: ExposedFunction;
}) => {
  // Remove `signer` or `&signer` field from the params
  // as they are auto-filled by the chain
  const executeFn = fn;
  executeFn.params =
    fn.params[0] === "signer" || fn.params[0] === "&signer"
      ? fn.params.slice(1)
      : fn.params;

  const { address } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const executeModuleTx = useExecuteModuleTx();
  const { broadcast } = useTxBroadcast();

  const [data, setData] = useState<AbiFormData>({
    args: getAbiInitialData(executeFn.params.length),
    typeArgs: getAbiInitialData(executeFn.generic_type_params.length),
  });
  const [abiErrors, setAbiErrors] = useState<[string, string][]>([
    ["form", "initial"],
  ]);

  const [composedTxMsgs, setComposedTxMsgs] = useState<EncodeObject[]>([]);
  const [simulateFeeError, setSimulateFeeError] = useState<string>();
  const [fee, setFee] = useState<StdFee>();
  const [processing, setProcessing] = useState(false);

  const enableExecute = useMemo(
    () =>
      Object.values(data.typeArgs).every((v) => v.length) &&
      !abiErrors.length &&
      Boolean(address),
    [data.typeArgs, abiErrors.length, address]
  );

  const { isFetching } = useSimulateFeeQuery({
    enabled: enableExecute,
    messages: composedTxMsgs,
    onError: (e) => {
      setSimulateFeeError(e.message);
      setFee(undefined);
    },
    onSuccess: (gasRes) => {
      setSimulateFeeError(undefined);
      if (gasRes) setFee(fabricateFee(gasRes));
      else setFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    const { args, typeArgs } = serializeAbiData(executeFn, data);
    const stream = await executeModuleTx({
      args,
      estimatedFee: fee,
      functionName: executeFn.name,
      moduleAddress,
      moduleName,
      onTxFailed: () => setProcessing(false),
      onTxSucceed: () => setProcessing(false),
      typeArgs,
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    broadcast,
    data,
    executeFn,
    executeModuleTx,
    fee,
    moduleAddress,
    moduleName,
  ]);

  useEffect(() => {
    if (enableExecute) {
      const { args, typeArgs } = serializeAbiData(executeFn, data);

      const composedMsgs = toEncodeObject([
        new MsgExecuteModule(
          address as string,
          moduleAddress,
          moduleName,
          executeFn.name,
          typeArgs,
          args
        ),
      ]);

      const timeoutId = setTimeout(() => {
        setComposedTxMsgs(composedMsgs);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }

    // Reset when the user disconnects
    setFee(undefined);
    return () => {};
  }, [address, data, enableExecute, executeFn, moduleAddress, moduleName]);

  const isButtonDisabled = !enableExecute || !fee || isFetching;
  return (
    <Flex direction="column">
      {fn.is_entry ? (
        <ConnectWalletAlert
          mb={8}
          subtitle="You need to connect your wallet to perform this action"
        />
      ) : (
        <Alert alignItems="center" gap={4} mb={8} variant="warning">
          <CustomIcon
            boxSize={4}
            color="warning.main"
            name="alert-triangle-solid"
          />
          <AlertDescription wordBreak="break-word">
            Title This function cannot be executed through this page. Only
            execute functions with “is_entry: true” and visibility is “public”
            or “friend” are able to interacted through Scan’s module
            interactions.
          </AlertDescription>
        </Alert>
      )}
      <AbiForm
        fn={executeFn}
        initialData={data}
        propsOnChange={setData}
        propsOnErrors={setAbiErrors}
      />
      {simulateFeeError && (
        <Alert alignItems="center" mt={4} variant="error">
          <AlertDescription wordBreak="break-word">
            {simulateFeeError}
          </AlertDescription>
        </Alert>
      )}
      <Flex alignItems="center" justify="space-between" mt={6}>
        <MoveCodeSnippet
          abiData={data}
          fn={fn}
          moduleAddress={moduleAddress}
          moduleName={moduleName}
          type="execute"
        />
        <Flex align="center" direction="row" gap={2}>
          <Flex alignItems="center" color="text.dark" fontSize="14px">
            Transaction fee:{" "}
            <EstimatedFeeRender estimatedFee={fee} loading={isFetching} />
          </Flex>
          <SubmitButton
            isDisabled={isButtonDisabled}
            isLoading={processing}
            text="Execute"
            onSubmit={() => {
              track(AmpEvent.ACTION_MOVE_EXECUTE);
              proceed();
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
