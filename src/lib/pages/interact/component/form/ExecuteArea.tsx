import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { MsgExecute as MsgExecuteModule } from "@initia/initia.js";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCurrentChain,
  useExecuteModuleTx,
  useFabricateFee,
  useSimulateFeeQuery,
} from "lib/app-provider";
import { AbiForm } from "lib/components/abi";
import { SubmitButton } from "lib/components/button";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";
import { getAbiInitialData, serializeAbiData, toEncodeObject } from "lib/utils";

const MoveCodeSnippet = dynamic(
  () => import("lib/components/modal/MoveCodeSnippet"),
  {
    ssr: false,
  }
);

export const ExecuteArea = ({
  moduleAddress,
  moduleName,
  fn,
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
    typeArgs: getAbiInitialData(executeFn.generic_type_params.length),
    args: getAbiInitialData(executeFn.params.length),
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
    const { typeArgs, args } = serializeAbiData(executeFn, data);
    const stream = await executeModuleTx({
      moduleAddress,
      moduleName,
      functionName: executeFn.name,
      typeArgs,
      args,
      estimatedFee: fee,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
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
      const { typeArgs, args } = serializeAbiData(executeFn, data);

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
    return () => {};
  }, [address, data, enableExecute, executeFn, moduleAddress, moduleName]);

  const isButtonDisabled = !enableExecute || !fee || isFetching;
  return (
    <Flex direction="column">
      {fn.is_entry ? (
        <ConnectWalletAlert
          subtitle="You need to connect your wallet to perform this action"
          mb={8}
        />
      ) : (
        <Alert variant="warning" mb={8} alignItems="center" gap={4}>
          <CustomIcon
            name="alert-circle-solid"
            boxSize={4}
            color="warning.main"
          />
          <AlertDescription wordBreak="break-word">
            Title This function cannot be executed through this page. Only
            execute functions with “is_entry: true” and visibility is “public”
            or “friend” are able to interacted through Celatone’s module
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
        <Alert variant="error" mt={4} alignItems="center">
          <AlertDescription wordBreak="break-word">
            {simulateFeeError}
          </AlertDescription>
        </Alert>
      )}
      <Flex alignItems="center" justify="space-between" mt={6}>
        <MoveCodeSnippet
          moduleAddress={moduleAddress}
          moduleName={moduleName}
          fn={fn}
          abiData={data}
          type="execute"
        />
        <Flex direction="row" align="center" gap={2}>
          <Flex fontSize="14px" color="text.dark" alignItems="center">
            Transaction Fee:{" "}
            <EstimatedFeeRender estimatedFee={fee} loading={isFetching} />
          </Flex>
          <SubmitButton
            text="Execute"
            isLoading={processing}
            onSubmit={() => {
              track(AmpEvent.ACTION_MOVE_EXECUTE);
              proceed();
            }}
            isDisabled={isButtonDisabled}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
