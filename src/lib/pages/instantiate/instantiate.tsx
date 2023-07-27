import { Flex, Heading, Text } from "@chakra-ui/react";
import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";
import Long from "long";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useFabricateFee,
  useInstantiateTx,
  useValidateAddress,
  useSimulateFeeQuery,
  useCurrentChain,
  useBaseApiRoute,
  CELATONE_QUERY_KEYS,
  useExampleAddresses,
  useAmplitudeTrack,
} from "lib/app-provider";
import { useAttachFunds } from "lib/app-provider/hooks/useAttachFunds";
import { AssignMe } from "lib/components/AssignMe";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import { AttachFund } from "lib/components/fund";
import { defaultAsset, defaultAssetJsonStr } from "lib/components/fund/data";
import type { AttachFundsState } from "lib/components/fund/types";
import { AttachFundsType } from "lib/components/fund/types";
import { CustomIcon } from "lib/components/icon";
import JsonInput from "lib/components/json/JsonInput";
import { CodeSelectSection } from "lib/components/select-code";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpTrack, AmpTrackAction } from "lib/services/amplitude";
import { getCodeIdInfo } from "lib/services/code";
import type { ComposedMsg, HumanAddr } from "lib/types";
import { AmpEvent, AccessConfigPermission, MsgType } from "lib/types";
import { composeMsg, jsonPrettify, jsonValidate, libDecode } from "lib/utils";

import { Footer } from "./component";
import type { InstantiateRedoMsg } from "./types";

interface InstantiatePageState {
  codeId: string;
  label: string;
  adminAddress: string;
  initMsg: string;
  simulateError: string;
}
interface InstantiatePageProps {
  onComplete: (txResult: InstantiateResult, contractLabel: string) => void;
}

const Instantiate = ({ onComplete }: InstantiatePageProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const router = useRouter();
  const msgQuery = (router.query.msg as string) ?? "";
  const codeIdQuery = (router.query["code-id"] as string) ?? "";
  const { user: exampleUserAddress } = useExampleAddresses();

  const { address = "" } = useCurrentChain();
  const lcdEndpoint = useBaseApiRoute("rest");

  const postInstantiateTx = useInstantiateTx();
  const fabricateFee = useFabricateFee();
  const { broadcast } = useTxBroadcast();
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const getAttachFunds = useAttachFunds();
  const { ampTrackToInstantiate } = useAmplitudeTrack();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);
  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const {
    control,
    formState: { errors: formErrors },
    setValue,
    watch,
  } = useForm<InstantiatePageState>({
    mode: "all",
    defaultValues: {
      codeId: "",
      label: "",
      adminAddress: "",
      initMsg: "",
    },
  });
  const { codeId, label, adminAddress, initMsg } = watch();

  const {
    control: assetsControl,
    setValue: setAssets,
    watch: watchAssets,
  } = useForm<AttachFundsState>({
    mode: "all",
    defaultValues: {
      assetsSelect: defaultAsset,
      assetsJsonStr: defaultAssetJsonStr,
      attachFundsOption: AttachFundsType.ATTACH_FUNDS_NULL,
    },
  });
  const { assetsSelect, assetsJsonStr, attachFundsOption } = watchAssets();

  const funds = getAttachFunds(attachFundsOption, assetsJsonStr, assetsSelect);
  const enableInstantiate = useMemo(
    () =>
      !!address &&
      codeId.length > 0 &&
      jsonValidate(initMsg) === null &&
      status.state === "success",
    [address, codeId.length, initMsg, status.state]
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
    onSuccess: (gasRes) => {
      if (gasRes) setEstimatedFee(fabricateFee(gasRes));
      else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const { refetch } = useQuery(
    [CELATONE_QUERY_KEYS.CODE_INFO, lcdEndpoint, codeId],
    async () => getCodeIdInfo(lcdEndpoint, codeId),
    {
      enabled: !!address && !!codeId.length,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        const permission = data.code_info.instantiate_permission;
        if (
          address &&
          (permission.permission === AccessConfigPermission.EVERYBODY ||
            permission.addresses.includes(address as HumanAddr) ||
            permission.address === address)
        )
          setStatus({ state: "success" });
        else {
          setStatus({
            state: "error",
            message:
              "This wallet does not have permission to instantiate to this code",
          });
        }
      },
      onError() {
        setStatus({ state: "error", message: "This code ID does not exist" });
      },
    }
  );

  // ------------------------------------------//
  // ----------------FUNCTIONS-----------------//
  // ------------------------------------------//
  const proceed = useCallback(async () => {
    AmpTrackAction(AmpEvent.ACTION_EXECUTE, funds.length, attachFundsOption);
    const stream = await postInstantiateTx({
      codeId: Number(codeId),
      initMsg: JSON.parse(initMsg),
      label,
      admin: adminAddress,
      funds,
      estimatedFee,
      onTxSucceed: (txResult, contractLabel) => {
        setProcessing(false);
        onComplete(txResult, contractLabel);
      },
      onTxFailed: () => setProcessing(false),
    });

    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    funds,
    attachFundsOption,
    postInstantiateTx,
    codeId,
    initMsg,
    label,
    adminAddress,
    estimatedFee,
    onComplete,
    broadcast,
  ]);

  // ------------------------------------------//
  // --------------SIDE EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    if (codeId.length) {
      setStatus({ state: "loading" });
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
    setStatus({ state: "init" });

    return () => {};
  }, [address, codeId, refetch]);

  useEffect(() => {
    if (enableInstantiate) {
      setSimulateError("");
      const composedMsg = composeMsg(MsgType.INSTANTIATE, {
        sender: address as HumanAddr,
        admin: adminAddress as HumanAddr,
        codeId: Long.fromString(codeId),
        label,
        msg: Buffer.from(initMsg),
        funds,
      });
      const timeoutId = setTimeout(() => {
        setComposedTxMsg([composedMsg]);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    adminAddress,
    codeId,
    enableInstantiate,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(funds),
    initMsg,
    label,
  ]);

  useEffect(() => {
    if (codeIdQuery) setValue("codeId", codeIdQuery);
    if (msgQuery) {
      const decodedMsg = libDecode(msgQuery);
      try {
        const msgObject = JSON.parse(decodedMsg) as InstantiateRedoMsg;

        setValue("codeId", msgObject.code_id.toString());
        setValue("label", msgObject.label);
        setValue("adminAddress", msgObject.admin);
        setValue("initMsg", JSON.stringify(msgObject.msg, null, 2));

        if (msgObject.funds.length) {
          setAssets("assetsSelect", defaultAsset);
          setAssets(
            "assetsJsonStr",
            jsonPrettify(JSON.stringify(msgObject.funds))
          );
          setAssets("attachFundsOption", AttachFundsType.ATTACH_FUNDS_JSON);
        }
      } catch {
        // comment just to avoid eslint no-empty
      }
    }
  }, [codeIdQuery, msgQuery, setAssets, setValue]);

  useEffect(() => {
    if (router.isReady) ampTrackToInstantiate(!!msgQuery, !!codeIdQuery);
  }, [router.isReady, msgQuery, codeIdQuery, ampTrackToInstantiate]);

  const validateAdmin = useCallback(
    (input: string) =>
      input && !!validateContractAddress(input) && !!validateUserAddress(input)
        ? "Invalid Address."
        : undefined,
    [validateContractAddress, validateUserAddress]
  );

  return (
    <>
      <WasmPageContainer>
        <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper mode="deploy" currentStep={2} />
        <Heading as="h5" variant="h5" my={12}>
          Instantiate new contract
        </Heading>
        <ConnectWalletAlert
          subtitle="You need to connect your wallet to perform this action"
          mb={6}
        />
        <CodeSelectSection
          name="codeId"
          control={control}
          status={status}
          error={formErrors.codeId?.message}
          onCodeSelect={(code: string) => setValue("codeId", code)}
          codeId={codeId}
        />
        <form style={{ width: "100%" }}>
          <ControllerInput
            name="label"
            control={control}
            error={formErrors.label?.message}
            placeholder="ex. Token Factory"
            label="Label"
            helperText="The contract's label help briefly describe the contract and what it does."
            variant="floating"
            mb={8}
            rules={{ required: "Label is required" }}
          />
          <ControllerInput
            name="adminAddress"
            control={control}
            label="Admin Address (optional)"
            placeholder={`ex. ${exampleUserAddress}`}
            helperText="The contract's admin will be able to migrate and update future admins."
            variant="floating"
            error={validateAdmin(adminAddress)}
            helperAction={
              <AssignMe
                onClick={() => {
                  AmpTrack(AmpEvent.USE_ASSIGN_ME);
                  setValue("adminAddress", address);
                }}
                isDisable={adminAddress === address}
              />
            }
          />
          <Heading variant="h6" as="h6" my={8} alignSelf="flex-start">
            Instantiate Message
          </Heading>
          <JsonInput
            text={initMsg}
            setText={(newVal: string) => setValue("initMsg", newVal)}
            minLines={10}
          />
          <Heading variant="h6" as="h6" my={8} alignSelf="flex-start">
            Send asset to contract
          </Heading>
          <AttachFund
            control={assetsControl}
            setValue={setAssets}
            attachFundsOption={attachFundsOption}
          />
        </form>
        {simulateError && (
          <Flex gap={2} mb={4}>
            <CustomIcon
              name="alert-circle-solid"
              boxSize={3}
              color="error.main"
            />
            <Text variant="body3" color="error.main">
              {simulateError}
            </Text>
          </Flex>
        )}
        <Flex
          fontSize="14px"
          color="text.dark"
          alignSelf="flex-start"
          alignItems="center"
          display="flex"
          gap={1}
        >
          <p>Transaction Fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
      </WasmPageContainer>
      <Footer
        onInstantiate={proceed}
        disabled={!enableInstantiate || isSimulating}
        loading={processing}
      />
    </>
  );
};

export default Instantiate;
