import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { RJSFValidationError } from "@rjsf/utils";
import type { FormStatus } from "lib/components/forms";
import type { AttachFundsState } from "lib/components/fund/types";
import type { Code } from "lib/services/types";
import type { BechAddr, BechAddr20, BechAddr32, ComposedMsg } from "lib/types";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import {
  AmpEvent,
  track,
  trackActionWithFunds,
  trackToInstantiate,
} from "lib/amplitude";
import {
  useCurrentChain,
  useExampleAddresses,
  useFabricateFee,
  useInstantiateContractTx,
  useTierConfig,
  useValidateAddress,
} from "lib/app-provider";
import { useAttachFunds } from "lib/app-provider/hooks/useAttachFunds";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { AssignMe } from "lib/components/AssignMe";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ControllerInput } from "lib/components/forms";
import { AttachFund } from "lib/components/fund";
import { defaultAsset, defaultAssetJsonStr } from "lib/components/fund/data";
import { AttachFundsType } from "lib/components/fund/types";
import { CustomIcon } from "lib/components/icon";
import {
  jsonInputFormKey,
  MessageInputContent,
  MessageInputSwitch,
  MessageTabs,
  SchemaInputSection,
  yourSchemaInputFormKey,
} from "lib/components/json-schema";
import JsonInput from "lib/components/json/JsonInput";
import { FooterCta } from "lib/components/layouts";
import { CodeSelectSection } from "lib/components/select-code";
import { CelatoneSeo } from "lib/components/Seo";
import { Stepper } from "lib/components/stepper";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useQueryEvents, useTxBroadcast } from "lib/hooks";
import { useSchemaStore } from "lib/providers/store";
import { useSimulateFeeQuery } from "lib/services/tx";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useCodeRest } from "lib/services/wasm/code";
import { MsgType } from "lib/types";
import {
  composeMsg,
  isId,
  jsonPrettify,
  jsonValidate,
  libDecode,
  resolvePermission,
} from "lib/utils";
import Long from "long";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { InstantiateFormState, InstantiateRedoMsg } from "./types";

import { zInstantiateQueryParams } from "./types";

interface InstantiateFormPageProps {
  onComplete: (
    txResult: DeliverTxResponse,
    contractLabel: string,
    contractAddress: BechAddr32,
    codeId: number,
    instantiator: BechAddr20
  ) => void;
}

const InstantiateFormPage = ({ onComplete }: InstantiateFormPageProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const router = useRouter();
  const { codeId: codeIdQuery, msg: msgQuery } = zInstantiateQueryParams.parse(
    router.query
  );
  const { user: exampleUserAddress } = useExampleAddresses();
  const { address } = useCurrentChain();
  const instantiateTx = useInstantiateContractTx();
  const fabricateFee = useFabricateFee();
  const { broadcast } = useTxBroadcast();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();
  const getAttachFunds = useAttachFunds();
  const { getSchemaByCodeHash } = useSchemaStore();
  const { isFullTier } = useTierConfig();
  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [tab, setTab] = useState<MessageTabs>();
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isValidJsonInput, setIsValidJsonInput] = useState(true);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const {
    control,
    formState: { errors: formErrors },
    setValue,
    watch,
  } = useForm<InstantiateFormState>({
    defaultValues: {
      adminAddress: "",
      codeHash: "",
      codeId: "",
      label: "",
      msgInput: {
        [jsonInputFormKey]: "{}",
        [yourSchemaInputFormKey]: "{}",
      },
    },
    mode: "all",
  });
  const { adminAddress, codeHash, codeId, label, msgInput } = watch();
  const currentInput = tab ? msgInput[tab] : "{}";

  const {
    control: assetsControl,
    setValue: setAssets,
    watch: watchAssets,
  } = useForm<AttachFundsState>({
    defaultValues: {
      assetsJsonStr: defaultAssetJsonStr,
      assetsSelect: defaultAsset,
      attachFundsOption: AttachFundsType.ATTACH_FUNDS_NULL,
    },
    mode: "all",
  });
  const { assetsJsonStr, assetsSelect, attachFundsOption } = watchAssets();

  // ------------------------------------------//
  // -------------------DATA-------------------//
  // ------------------------------------------//
  const { data: derivedWasmVerifyInfo } = useDerivedWasmVerifyInfo(
    isId(codeId) ? Number(codeId) : undefined,
    codeHash
  );

  // ------------------------------------------//
  // ------------------LOGICS------------------//
  // ------------------------------------------//
  const verifiedSchema = derivedWasmVerifyInfo?.schema;
  const localSchema = getSchemaByCodeHash(codeHash);

  const funds = getAttachFunds(attachFundsOption, assetsJsonStr, assetsSelect);
  const enableInstantiate = useMemo(() => {
    const generalChecks =
      Boolean(address) &&
      Boolean(label) &&
      isId(codeId) &&
      status.state === "success";

    switch (tab) {
      case MessageTabs.JSON_INPUT:
        return generalChecks && jsonValidate(currentInput) === null;
      case MessageTabs.YOUR_SCHEMA:
        return generalChecks && isValidJsonInput;
      default:
        return false;
    }
  }, [
    address,
    label,
    codeId,
    status.state,
    tab,
    currentInput,
    isValidJsonInput,
  ]);

  // ------------------------------------------//
  // ---------------SIMUATE FEE----------------//
  // ------------------------------------------//
  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
    onSuccess: (gasRes) => {
      if (gasRes) setEstimatedFee(fabricateFee(gasRes));
      else setEstimatedFee(undefined);
    },
  });

  const codeRestQuery = useCodeRest(Number(codeId), {
    enabled: false,
    gcTime: 0,
    retry: false,
  });
  useQueryEvents(codeRestQuery, {
    onError: () => {
      setStatus({ message: "This code ID does not exist", state: "error" });
      setSimulateError("");
    },
    onSuccess: (data) => {
      setValue("codeHash", data.hash.toLowerCase());
      if (
        resolvePermission(
          address,
          data.instantiatePermission,
          data.permissionAddresses
        )
      )
        setStatus({ state: "success" });
      else {
        setStatus({
          message:
            "This wallet does not have permission to instantiate to this code",
          state: "error",
        });
      }
    },
  });
  const { refetch } = codeRestQuery;

  // ------------------------------------------//
  // ----------------CALLBACKS-----------------//
  // ------------------------------------------//
  const resetMsgInputSchema = useCallback(() => {
    setValue(`msgInput.${yourSchemaInputFormKey}`, "{}");
  }, [setValue]);

  const handleChange = useCallback(
    (data: unknown, errors: RJSFValidationError[]) => {
      setIsValidJsonInput(errors.length === 0);
      setValue(`msgInput.${yourSchemaInputFormKey}`, JSON.stringify(data));
    },
    [setValue]
  );

  const validateAdmin = useCallback(
    (input: string) =>
      input && !!validateContractAddress(input) && !!validateUserAddress(input)
        ? "Invalid Address."
        : undefined,
    [validateContractAddress, validateUserAddress]
  );

  const proceed = useCallback(async () => {
    trackActionWithFunds(
      AmpEvent.ACTION_INSTANTIATE,
      funds.length,
      attachFundsOption,
      tab === MessageTabs.YOUR_SCHEMA ? "schema" : "json-input"
    );
    const stream = await instantiateTx({
      admin: adminAddress,
      codeId: Number(codeId),
      estimatedFee,
      funds,
      initMsg: JSON.parse(currentInput),
      label,
      onTxFailed: () => setProcessing(false),
      onTxSucceed: (txResult, contractLabel, contractAddress) => {
        setProcessing(false);
        onComplete(
          txResult,
          contractLabel,
          contractAddress,
          Number(codeId),
          address ?? ("" as BechAddr20)
        );
      },
    });

    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    address,
    adminAddress,
    attachFundsOption,
    broadcast,
    codeId,
    currentInput,
    estimatedFee,
    funds,
    label,
    onComplete,
    instantiateTx,
    tab,
  ]);

  // ------------------------------------------//
  // --------------SIDE EFFECTS----------------//
  // ------------------------------------------//
  /** Remark: parsing initial msg, initial funds from query params */
  useEffect(() => {
    if (codeIdQuery) setValue("codeId", codeIdQuery.toString());
    if (msgQuery) {
      const decodedMsg = libDecode(msgQuery);
      try {
        const msgObject = JSON.parse(decodedMsg) as InstantiateRedoMsg;
        setValue("codeId", msgObject.code_id.toString());
        setValue("label", msgObject.label);
        setValue("adminAddress", msgObject.admin);
        setValue(
          `msgInput.${jsonInputFormKey}`,
          JSON.stringify(msgObject.msg, null, 2)
        );
        setValue(
          `msgInput.${yourSchemaInputFormKey}`,
          JSON.stringify(msgObject.msg)
        );

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
    setValue("codeHash", "");
    setTab(MessageTabs.JSON_INPUT);
    if (codeId) {
      setStatus({ state: "loading" });
      const timer = setTimeout(() => {
        if (codeId) refetch();
        else setStatus({ message: "Invalid Code ID", state: "error" });
      }, 500);
      return () => clearTimeout(timer);
    }
    setStatus({ state: "init" });

    return () => {};
  }, [codeId, refetch, setValue, setTab]);

  useEffect(() => {
    if (enableInstantiate) {
      setSimulateError("");
      const composedMsg = address
        ? [
            composeMsg(MsgType.INSTANTIATE, {
              admin: adminAddress as BechAddr,
              codeId: Long.fromString(codeId),
              funds,
              label,
              msg: Buffer.from(currentInput),
              sender: address,
            }),
          ]
        : [];
      const timeoutId = setTimeout(() => {
        setComposedTxMsg(composedMsg);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }

    // reset estimated fee and error when user change the input
    setSimulateError("");
    setEstimatedFee(undefined);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    adminAddress,
    codeId,
    enableInstantiate,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(funds),
    currentInput,
    label,
  ]);

  useEffect(() => {
    if (localSchema) {
      setTab(MessageTabs.YOUR_SCHEMA);
    }
  }, [localSchema, setValue]);

  useEffect(() => {
    if (router.isReady) trackToInstantiate(!!msgQuery, !!codeIdQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <ActionPageContainer>
        <CelatoneSeo pageName="Instantiate contract" />
        <Text color="text.dark" fontWeight={700} mb={3} variant="body1">
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper currentStep={2} mode="deploy" />
        <Flex alignItems="center" direction="column" my={12}>
          <Heading as="h5" variant="h5">
            Instantiate new contract
          </Heading>
          <UserDocsLink
            cta="View instantiate guideline"
            href="cosmwasm/upload-instantiate#instantiate-contract-from-code"
            isDevTool
            mt={2}
          />
        </Flex>
        <ConnectWalletAlert
          mb={6}
          subtitle="You need to connect your wallet to perform this action"
        />
        <Box w="100%">
          {!isFullTier && (
            <Heading alignSelf="flex-start" as="h6" mb={6} mt={4} variant="h6">
              Code ID
            </Heading>
          )}
          <CodeSelectSection
            codeId={isId(codeId) ? Number(codeId) : undefined}
            control={control}
            error={formErrors.codeId?.message}
            name="codeId"
            setCodeHash={(data: Code) =>
              setValue("codeHash", data.hash.toLowerCase())
            }
            status={status}
            onCodeSelect={(code: number) => {
              setValue("codeId", code.toString());
              resetMsgInputSchema();
            }}
          />
        </Box>
        <form style={{ width: "100%" }}>
          <Heading alignSelf="flex-start" as="h6" mb={6} mt={4} variant="h6">
            Label
          </Heading>
          <ControllerInput
            control={control}
            error={formErrors.label?.message}
            helperText="The contract's label help briefly describe the contract and what it does."
            label="Label"
            mb={12}
            name="label"
            placeholder="ex. Token Factory"
            rules={{ required: "Label is required" }}
            variant="fixed-floating"
          />
          <Heading alignSelf="flex-start" as="h6" my={6} variant="h6">
            Admin Address
          </Heading>
          <ControllerInput
            control={control}
            error={validateAdmin(adminAddress)}
            helperAction={
              <AssignMe
                isDisable={adminAddress === address}
                onClick={() => {
                  track(AmpEvent.USE_ASSIGN_ME);
                  setValue("adminAddress", address ?? "");
                }}
              />
            }
            helperText="The contract's admin will be able to migrate and update future admins."
            label="Admin Address (optional)"
            name="adminAddress"
            placeholder={`ex. ${exampleUserAddress}`}
            variant="fixed-floating"
          />
          <Flex align="center" justify="space-between" mb={4} mt={12}>
            <Heading alignSelf="flex-start" as="h6" variant="h6">
              Instantiate Message
            </Heading>
            <MessageInputSwitch
              currentTab={tab}
              disabled={!codeHash}
              onTabChange={setTab}
            />
          </Flex>
          <MessageInputContent
            currentTab={tab}
            jsonContent={
              <JsonInput
                minLines={10}
                setText={(newVal: string) =>
                  setValue(`msgInput.${jsonInputFormKey}`, newVal)
                }
                text={msgInput[jsonInputFormKey]}
              />
            }
            schemaContent={
              isId(codeId) && (
                <SchemaInputSection
                  codeHash={codeHash}
                  codeId={Number(codeId)}
                  handleChange={handleChange}
                  initialFormData={JSON.parse(msgInput[yourSchemaInputFormKey])}
                  localSchema={localSchema}
                  type="instantiate"
                  verifiedSchema={verifiedSchema}
                  onSchemaSave={resetMsgInputSchema}
                />
              )
            }
          />
          <Heading alignSelf="flex-start" as="h6" mb={6} mt={12} variant="h6">
            Send asset to contract
          </Heading>
          <AttachFund
            attachFundsOption={attachFundsOption}
            control={assetsControl}
            setValue={setAssets}
          />
        </form>
        {simulateError && (
          <Flex gap={2} mb={4}>
            <CustomIcon
              boxSize={3}
              color="error.main"
              name="alert-triangle-solid"
            />
            <Text color="error.main" variant="body3">
              {simulateError}
            </Text>
          </Flex>
        )}
        <Flex
          alignItems="center"
          alignSelf="flex-start"
          color="text.dark"
          display="flex"
          fontSize="14px"
          gap={1}
        >
          <p>Transaction fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
      </ActionPageContainer>
      <FooterCta
        actionButton={{
          isDisabled: !enableInstantiate || !estimatedFee || isSimulating,
          onClick: proceed,
        }}
        actionLabel="Instantiate"
        cancelButton={{
          leftIcon: <CustomIcon name="chevron-left" />,
          onClick: router.back,
        }}
        loading={processing}
      />
    </>
  );
};

export default InstantiateFormPage;
