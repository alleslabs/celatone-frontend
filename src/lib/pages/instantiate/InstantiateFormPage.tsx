import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { RJSFValidationError } from "@rjsf/utils";
import Long from "long";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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
import type { FormStatus } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import { AttachFund } from "lib/components/fund";
import { defaultAsset, defaultAssetJsonStr } from "lib/components/fund/data";
import type { AttachFundsState } from "lib/components/fund/types";
import { AttachFundsType } from "lib/components/fund/types";
import { CustomIcon } from "lib/components/icon";
import JsonInput from "lib/components/json/JsonInput";
import {
  jsonInputFormKey,
  MessageInputContent,
  MessageInputSwitch,
  MessageTabs,
  SchemaInputSection,
  yourSchemaInputFormKey,
} from "lib/components/json-schema";
import { FooterCta } from "lib/components/layouts";
import { CodeSelectSection } from "lib/components/select-code";
import { CelatoneSeo } from "lib/components/Seo";
import { Stepper } from "lib/components/stepper";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useTxBroadcast } from "lib/hooks";
import { useSchemaStore } from "lib/providers/store";
import { useSimulateFeeQuery } from "lib/services/tx";
import type { Code } from "lib/services/types";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useCodeRest } from "lib/services/wasm/code";
import type { BechAddr, BechAddr20, BechAddr32, ComposedMsg } from "lib/types";
import { MsgType } from "lib/types";
import {
  composeMsg,
  isId,
  jsonPrettify,
  jsonValidate,
  libDecode,
  resolvePermission,
} from "lib/utils";

import { zInstantiateQueryParams } from "./types";
import type { InstantiateFormState, InstantiateRedoMsg } from "./types";

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
  const { msg: msgQuery, codeId: codeIdQuery } = zInstantiateQueryParams.parse(
    router.query
  );
  const { user: exampleUserAddress } = useExampleAddresses();
  const { address } = useCurrentChain();
  const instantiateTx = useInstantiateContractTx();
  const fabricateFee = useFabricateFee();
  const { broadcast } = useTxBroadcast();
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
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
    mode: "all",
    defaultValues: {
      codeId: "",
      codeHash: "",
      label: "",
      adminAddress: "",
      msgInput: {
        [jsonInputFormKey]: "{}",
        [yourSchemaInputFormKey]: "{}",
      },
    },
  });
  const { codeId, codeHash, label, adminAddress, msgInput } = watch();
  const currentInput = tab ? msgInput[tab] : "{}";

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
    onSuccess: (gasRes) => {
      if (gasRes) setEstimatedFee(fabricateFee(gasRes));
      else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const { refetch } = useCodeRest(Number(codeId), {
    enabled: false,
    retry: false,
    cacheTime: 0,
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
          state: "error",
          message:
            "This wallet does not have permission to instantiate to this code",
        });
      }
    },
    onError: () => {
      setStatus({ state: "error", message: "This code ID does not exist" });
      setSimulateError("");
    },
  });

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
      codeId: Number(codeId),
      initMsg: JSON.parse(currentInput),
      label,
      admin: adminAddress,
      funds,
      estimatedFee,
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
      onTxFailed: () => setProcessing(false),
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
        else setStatus({ state: "error", message: "Invalid Code ID" });
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
              sender: address,
              admin: adminAddress as BechAddr,
              codeId: Long.fromString(codeId),
              label,
              msg: Buffer.from(currentInput),
              funds,
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
        <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper mode="deploy" currentStep={2} />
        <Flex direction="column" alignItems="center" my={12}>
          <Heading as="h5" variant="h5">
            Instantiate new contract
          </Heading>
          <UserDocsLink
            isDevTool
            mt={2}
            cta="View instantiate guideline"
            href="cosmwasm/upload-instantiate#instantiate-contract-from-code"
          />
        </Flex>
        <ConnectWalletAlert
          subtitle="You need to connect your wallet to perform this action"
          mb={6}
        />
        <Box w="100%">
          {!isFullTier && (
            <Heading variant="h6" as="h6" mt={4} mb={6} alignSelf="flex-start">
              Code ID
            </Heading>
          )}
          <CodeSelectSection
            codeId={isId(codeId) ? Number(codeId) : undefined}
            name="codeId"
            control={control}
            error={formErrors.codeId?.message}
            onCodeSelect={(code: number) => {
              setValue("codeId", code.toString());
              resetMsgInputSchema();
            }}
            setCodeHash={(data: Code) =>
              setValue("codeHash", data.hash.toLowerCase())
            }
            status={status}
          />
        </Box>
        <form style={{ width: "100%" }}>
          <Heading variant="h6" as="h6" mt={4} mb={6} alignSelf="flex-start">
            Label
          </Heading>
          <ControllerInput
            name="label"
            control={control}
            error={formErrors.label?.message}
            placeholder="ex. Token Factory"
            label="Label"
            helperText="The contract's label help briefly describe the contract and what it does."
            variant="fixed-floating"
            mb={12}
            rules={{ required: "Label is required" }}
          />
          <Heading variant="h6" as="h6" my={6} alignSelf="flex-start">
            Admin Address
          </Heading>
          <ControllerInput
            name="adminAddress"
            control={control}
            label="Admin Address (optional)"
            placeholder={`ex. ${exampleUserAddress}`}
            helperText="The contract's admin will be able to migrate and update future admins."
            variant="fixed-floating"
            error={validateAdmin(adminAddress)}
            helperAction={
              <AssignMe
                onClick={() => {
                  track(AmpEvent.USE_ASSIGN_ME);
                  setValue("adminAddress", address ?? "");
                }}
                isDisable={adminAddress === address}
              />
            }
          />
          <Flex align="center" justify="space-between" mt={12} mb={4}>
            <Heading variant="h6" as="h6" alignSelf="flex-start">
              Instantiate Message
            </Heading>
            <MessageInputSwitch
              currentTab={tab}
              onTabChange={setTab}
              disabled={!codeHash}
            />
          </Flex>
          <MessageInputContent
            currentTab={tab}
            jsonContent={
              <JsonInput
                text={msgInput[jsonInputFormKey]}
                setText={(newVal: string) =>
                  setValue(`msgInput.${jsonInputFormKey}`, newVal)
                }
                minLines={10}
              />
            }
            schemaContent={
              isId(codeId) && (
                <SchemaInputSection
                  type="instantiate"
                  codeHash={codeHash}
                  codeId={Number(codeId)}
                  verifiedSchema={verifiedSchema}
                  localSchema={localSchema}
                  initialFormData={JSON.parse(msgInput[yourSchemaInputFormKey])}
                  handleChange={handleChange}
                  onSchemaSave={resetMsgInputSchema}
                />
              )
            }
          />
          <Heading variant="h6" as="h6" mt={12} mb={6} alignSelf="flex-start">
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
              name="alert-triangle-solid"
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
          <p>Transaction fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
      </ActionPageContainer>
      <FooterCta
        loading={processing}
        cancelButton={{
          onClick: router.back,
          leftIcon: <CustomIcon name="chevron-left" />,
        }}
        actionButton={{
          isDisabled: !enableInstantiate || !estimatedFee || isSimulating,
          onClick: proceed,
        }}
        actionLabel="Instantiate"
      />
    </>
  );
};

export default InstantiateFormPage;
