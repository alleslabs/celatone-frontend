import type { StdFee } from "@cosmjs/stargate";
import type { AbiFormData, ExposedFunction, Option } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCurrentChain,
  useFabricateFee,
  useMoveConfig,
} from "lib/app-provider";
import { useDeployScriptTx } from "lib/app-provider/tx/script";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeQuery } from "lib/services/tx";
import { composeScriptMsg, getAbiInitialData } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Footer } from "./components/Footer";
import { ScriptInput } from "./components/ScriptInput";
import { UploadScriptCard } from "./components/UploadScriptCard";

export interface FileState {
  file: Option<File>;
  base64File: string;
  decodeRes: Option<ExposedFunction>;
}

const DEFAULT_FILE_STATE: FileState = {
  base64File: "",
  decodeRes: undefined,
  file: undefined,
};

export const DeployScript = () => {
  useMoveConfig({ shouldRedirect: true });

  const router = useRouter();
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
    args: {},
    typeArgs: {},
  });
  const [abiErrors, setAbiErrors] = useState<[string, string][]>([
    ["form", "initial"],
  ]);

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
    setInputData({ args: {}, typeArgs: {} });
    setAbiErrors([["form", "initial"]]);
  }, []);

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: enableDeploy,
    messages: composeScriptMsg(
      address,
      fileState.base64File,
      fileState.decodeRes,
      inputData
    ),
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
    onSuccess: (gasRes) => {
      if (gasRes) {
        setEstimatedFee(fabricateFee(gasRes));
        setSimulateError("");
      } else setEstimatedFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    const stream = await deployScriptTx({
      estimatedFee,
      messages: composeScriptMsg(
        address,
        fileState.base64File,
        fileState.decodeRes,
        inputData
      ),
      onTxFailed: () => setProcessing(false),
      onTxSucceed: () => setProcessing(false),
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
    if (router.isReady) track(AmpEvent.TO_DEPLOY_SCRIPT);
  }, [router.isReady]);

  return (
    <>
      <CelatoneSeo pageName="Deploy script" />
      <ActionPageContainer>
        <Heading as="h4" variant="h4">
          Deploy script
        </Heading>
        <div
          style={{
            color: "var(--chakra-colors-text-dark)",
            marginBottom: "48px",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          Upload a .mv file to deploy one-time use script which execute
          messages.{" "}
          <UserDocsLink
            cta="Read more about Deploy Script"
            href="initia/move/deploy-script"
            isDevTool
            isInline
            mt={0}
          />
        </div>
        <ConnectWalletAlert
          mb={12}
          subtitle="You need to connect your wallet to perform this action"
        />
        <Heading alignSelf="start" as="h6" mb={6} variant="h6">
          Upload .mv file
        </Heading>
        <UploadScriptCard
          fileState={fileState}
          removeFile={resetState}
          setFile={(
            file: Option<File>,
            base64File: string,
            decodeRes: Option<ExposedFunction>
          ) => {
            setFileState({ base64File, decodeRes, file });
            if (decodeRes)
              setInputData({
                args: getAbiInitialData(decodeRes.params.length),
                typeArgs: getAbiInitialData(
                  decodeRes.generic_type_params.length
                ),
              });
          }}
        />
        <Heading alignSelf="start" as="h6" mb={4} mt={8} variant="h6">
          Script input
        </Heading>
        <ScriptInput
          fn={fileState.decodeRes}
          initialData={inputData}
          propsOnChange={setInputData}
          propsOnErrors={setAbiErrors}
        />
        <Flex
          alignItems="center"
          alignSelf="flex-start"
          color="text.dark"
          fontSize="14px"
          gap={1}
          mt={8}
        >
          <p>Transaction fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
        {simulateError && (
          <ErrorMessageRender
            alignSelf="flex-start"
            error={simulateError}
            mt={2}
          />
        )}
      </ActionPageContainer>
      <Footer
        disabled={!enableDeploy || Boolean(simulateError) || isSimulating}
        executeScript={() => {
          track(AmpEvent.ACTION_EXECUTE_SCRIPT);
          proceed();
        }}
        isLoading={processing}
      />
    </>
  );
};
