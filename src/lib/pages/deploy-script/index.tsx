import { Flex, Heading, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useCurrentChain,
  useFabricateFee,
  useSimulateFeeQuery,
} from "lib/app-provider";
import { useDeployScriptTx } from "lib/app-provider/tx/script";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type {
  ExposedFunction,
  HumanAddr,
  Option,
  AbiFormData,
} from "lib/types";
import { composeScriptMsg, getAbiInitialData } from "lib/utils";

import { Footer } from "./components/Footer";
import { ScriptInput } from "./components/ScriptInput";
import { UploadScriptCard } from "./components/UploadScriptCard";

export interface FileState {
  file: Option<File>;
  base64File: string;
  decodeRes: Option<ExposedFunction>;
}

const DEFAULT_FILE_STATE: FileState = {
  file: undefined,
  base64File: "",
  decodeRes: undefined,
};

export const DeployScript = () => {
  const { address } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const deployScriptTx = useDeployScriptTx();
  const { broadcast } = useTxBroadcast();

  // File State
  const [fileState, setFileState] = useState<FileState>(DEFAULT_FILE_STATE);
  // TX State
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);
  // Form State
  const [inputData, setInputData] = useState<AbiFormData>({
    typeArgs: {},
    args: {},
  });
  const [abiErrors, setAbiErrors] = useState<[string, string][]>([]);

  const enableDeploy = useMemo(
    () =>
      Boolean(
        address &&
          fileState.base64File &&
          fileState.decodeRes &&
          !abiErrors.length &&
          Object.values(inputData.typeArgs).every((val) => val.trim())
      ),
    [
      address,
      fileState.base64File,
      fileState.decodeRes,
      abiErrors,
      inputData.typeArgs,
    ]
  );

  const resetState = useCallback(() => {
    setFileState(DEFAULT_FILE_STATE);
    setEstimatedFee(undefined);
    setSimulateError("");
    setInputData({ typeArgs: {}, args: {} });
    setAbiErrors([]);
  }, []);

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: enableDeploy,
    messages: composeScriptMsg(
      address as HumanAddr,
      fileState.base64File,
      fileState.decodeRes,
      inputData
    ),
    onSuccess: (gasRes) => {
      if (gasRes) {
        setEstimatedFee(fabricateFee(gasRes));
        setSimulateError("");
      } else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    const stream = await deployScriptTx({
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
      estimatedFee,
      messages: composeScriptMsg(
        address as HumanAddr,
        fileState.base64File,
        fileState.decodeRes,
        inputData
      ),
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    address,
    broadcast,
    deployScriptTx,
    estimatedFee,
    fileState.base64File,
    fileState.decodeRes,
    inputData,
  ]);

  useEffect(() => {
    const script = fileState.decodeRes;
    if (script) {
      setInputData({
        typeArgs: getAbiInitialData(script.generic_type_params.length),
        args: getAbiInitialData(script.params.length),
      });
    }
  }, [fileState.decodeRes]);

  return (
    <>
      <WasmPageContainer>
        <Heading as="h4" variant="h4">
          Script
        </Heading>
        <Text fontWeight={600} variant="body2" color="text.dark" mt={2} mb={12}>
          Upload a .mv file to deploy one-time use Script which execute
          messages.
        </Text>
        <ConnectWalletAlert
          subtitle="You need to connect your wallet to perform this action"
          mb={12}
        />
        <Heading as="h6" variant="h6" mb={6} alignSelf="start">
          Upload .mv file
        </Heading>
        <UploadScriptCard
          fileState={fileState}
          removeFile={resetState}
          setFile={(
            file: Option<File>,
            base64File: string,
            decodeRes: Option<ExposedFunction>
          ) => setFileState({ file, base64File, decodeRes })}
        />
        <Heading as="h6" variant="h6" mt={8} mb={4} alignSelf="start">
          Script input
        </Heading>
        <ScriptInput
          fn={fileState.decodeRes}
          initialData={inputData}
          propsOnChange={setInputData}
          propsOnErrors={setAbiErrors}
        />
        <Flex
          mt={8}
          fontSize="14px"
          color="text.dark"
          alignSelf="flex-start"
          alignItems="center"
          gap={1}
        >
          <p>Transaction Fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
        {simulateError && (
          <ErrorMessageRender
            error={simulateError}
            mt={2}
            alignSelf="flex-start"
          />
        )}
      </WasmPageContainer>
      <Footer
        isLoading={processing}
        disabled={!enableDeploy || Boolean(simulateError) || isSimulating}
        executeScript={proceed}
      />
    </>
  );
};
