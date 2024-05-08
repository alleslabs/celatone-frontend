import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import type { RJSFValidationError } from "@rjsf/utils";
import Long from "long";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, trackAction } from "lib/amplitude";
import {
  useCurrentChain,
  useFabricateFee,
  useSimulateFeeQuery,
} from "lib/app-provider";
import { useMigrateTx } from "lib/app-provider/tx/migrate";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { FormStatus } from "lib/components/forms";
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
import { CodeSelectSection } from "lib/components/select-code";
import { useTxBroadcast } from "lib/hooks";
import { useSchemaStore } from "lib/providers/store";
import type { CodeInfoResponseLcd } from "lib/services/wasm/code";
import { useCodeInfoLcd } from "lib/services/wasm/code";
import type { BechAddr32, ComposedMsg } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, isId, jsonValidate, resolvePermission } from "lib/utils";

interface MigrateContractProps {
  contractAddress: BechAddr32;
  codeIdParam: string;
  handleBack: () => void;
}

export const MigrateContract = ({
  contractAddress,
  codeIdParam,
  handleBack,
}: MigrateContractProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const { address } = useCurrentChain();
  const { broadcast } = useTxBroadcast();
  const migrateTx = useMigrateTx();
  const fabricateFee = useFabricateFee();
  const { getSchemaByCodeHash } = useSchemaStore();

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const {
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      codeId: codeIdParam,
      codeHash: "",
      msgInput: {
        [jsonInputFormKey]: "{}",
        [yourSchemaInputFormKey]: "{}",
      },
    },
    mode: "all",
  });
  const { codeId, codeHash, msgInput } = watch();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [tab, setTab] = useState<MessageTabs>();
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isValidJsonInput, setIsValidJsonInput] = useState(false);

  // ------------------------------------------//
  // ------------------LOGICS------------------//
  // ------------------------------------------//
  const currentInput = tab ? msgInput[tab] : "{}";
  const jsonSchema = getSchemaByCodeHash(codeHash);
  const enableMigrate = useMemo(() => {
    const generalChecks =
      Boolean(address) && isId(codeId) && status.state === "success";

    switch (tab) {
      case MessageTabs.JSON_INPUT:
        return generalChecks && jsonValidate(currentInput) === null;
      case MessageTabs.YOUR_SCHEMA:
        return generalChecks && isValidJsonInput;
      default:
        return false;
    }
  }, [address, codeId, currentInput, isValidJsonInput, status.state, tab]);

  // ------------------------------------------//
  // ---------------SIMUATE FEE----------------//
  // ------------------------------------------//
  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
    onSuccess: (gasRes) =>
      gasRes
        ? setEstimatedFee(fabricateFee(gasRes))
        : setEstimatedFee(undefined),
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const { refetch } = useCodeInfoLcd(codeId, {
    enabled: false,
    retry: false,
    cacheTime: 0,
    onSuccess(data) {
      const permission = data.codeInfo.instantiatePermission;
      setValue("codeHash", data.codeInfo.dataHash.toLowerCase());
      if (
        resolvePermission(address, permission.permission, permission.addresses)
      )
        setStatus({ state: "success" });
      else {
        setStatus({
          state: "error",
          message:
            "This wallet does not have permission to migrate to this code",
        });
        setSimulateError("");
      }
    },
    onError() {
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

  const proceed = useCallback(async () => {
    trackAction(
      AmpEvent.ACTION_MIGRATE,
      tab === MessageTabs.YOUR_SCHEMA ? "schema" : "json-input"
    );
    const stream = await migrateTx({
      contractAddress,
      codeId: Number(codeId),
      migrateMsg: JSON.parse(currentInput),
      estimatedFee,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
    });

    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    migrateTx,
    tab,
    contractAddress,
    codeId,
    currentInput,
    estimatedFee,
    broadcast,
    setProcessing,
  ]);

  // ------------------------------------------//
  // --------------SIDE EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    setValue("codeHash", "");
    setTab(MessageTabs.JSON_INPUT);
    if (codeId.length) {
      setStatus({ state: "loading" });
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
    setStatus({ state: "init" });

    return () => {};
  }, [address, codeId, refetch, setValue, setTab]);

  useEffect(() => {
    if (enableMigrate) {
      setSimulateError("");
      const composedMsg = address
        ? [
            composeMsg(MsgType.MIGRATE, {
              sender: address,
              contract: contractAddress,
              codeId: Long.fromString(codeId),
              msg: Buffer.from(currentInput),
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
  }, [address, codeId, contractAddress, enableMigrate, currentInput]);

  useEffect(() => {
    if (jsonSchema) setTab(MessageTabs.YOUR_SCHEMA);
  }, [jsonSchema]);

  return (
    <>
      <Heading as="h6" variant="h6" mb={4}>
        To Code ID
      </Heading>
      <CodeSelectSection
        name="codeId"
        control={control}
        status={status}
        error={formErrors.codeId?.message}
        onCodeSelect={(code: string) => {
          setValue("codeId", code);
          resetMsgInputSchema();
        }}
        setCodeHash={(data: CodeInfoResponseLcd) => {
          setValue("codeHash", data.codeInfo.dataHash.toLowerCase());
        }}
        codeId={codeId}
      />
      <Flex align="center" justify="space-between" mt={12} mb={6}>
        <Heading as="h6" variant="h6">
          Migrate Message
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
            text={msgInput[MessageTabs.JSON_INPUT]}
            setText={(msg: string) =>
              setValue(`msgInput.${jsonInputFormKey}`, msg)
            }
            minLines={10}
          />
        }
        schemaContent={
          isId(codeId) && (
            <SchemaInputSection
              type="migrate"
              codeHash={codeHash}
              codeId={Number(codeId)}
              jsonSchema={jsonSchema}
              handleChange={handleChange}
              onSchemaSave={resetMsgInputSchema}
            />
          )
        }
      />
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
      <Flex justify="space-between" w="100%" mt={8}>
        <Button
          variant="outline-gray"
          w="128px"
          leftIcon={<CustomIcon name="chevron-left" />}
          onClick={handleBack}
        >
          Previous
        </Button>
        <Button
          variant="primary"
          w="128px"
          isDisabled={!enableMigrate || !estimatedFee || isSimulating}
          onClick={proceed}
          isLoading={processing}
          sx={{ pointerEvents: processing && "none" }}
        >
          Migrate
        </Button>
      </Flex>
    </>
  );
};
