import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import type { RJSFValidationError } from "@rjsf/utils";
import Long from "long";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, trackAction } from "lib/amplitude";
import { useCurrentChain, useFabricateFee } from "lib/app-provider";
import { useMigrateContractTx } from "lib/app-provider/tx/migrate";
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
import { useSimulateFeeQuery } from "lib/services/tx";
import type { Code } from "lib/services/types";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useCodeLcd } from "lib/services/wasm/code";
import type { BechAddr32, ComposedMsg, Option } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, jsonValidate, resolvePermission } from "lib/utils";

interface MigrateContractProps {
  codeIdParam: Option<number>;
  contractAddress: BechAddr32;
  handleBack: () => void;
}

export const MigrateContract = ({
  codeIdParam,
  contractAddress,
  handleBack,
}: MigrateContractProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const { address } = useCurrentChain();
  const { broadcast } = useTxBroadcast();
  const migrateTx = useMigrateContractTx();
  const fabricateFee = useFabricateFee();
  const { getSchemaByCodeHash } = useSchemaStore();

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const {
    control,
    formState: { errors: formErrors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      codeHash: "",
      codeId: codeIdParam ?? 0,
      msgInput: {
        [jsonInputFormKey]: "{}",
        [yourSchemaInputFormKey]: "{}",
      },
    },
    mode: "all",
  });
  const { codeHash, codeId, msgInput } = watch();

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
  // -------------------DATA-------------------//
  // ------------------------------------------//
  const { data: derivedWasmVerifyInfo } = useDerivedWasmVerifyInfo(
    codeId,
    codeHash
  );

  // ------------------------------------------//
  // ------------------LOGICS------------------//
  // ------------------------------------------//
  const currentInput = tab ? msgInput[tab] : "{}";
  const verifiedSchema = derivedWasmVerifyInfo?.schema;
  const localSchema = getSchemaByCodeHash(codeHash);

  const enableMigrate = useMemo(() => {
    const generalChecks =
      Boolean(address) && codeId && status.state === "success";

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
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
    onSuccess: (gasRes) =>
      gasRes
        ? setEstimatedFee(fabricateFee(gasRes))
        : setEstimatedFee(undefined),
  });

  const { refetch } = useCodeLcd(codeId, {
    cacheTime: 0,
    enabled: false,
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
            "This wallet does not have permission to migrate to this code",
          state: "error",
        });
        setSimulateError("");
      }
    },
    retry: false,
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
      codeId,
      contractAddress,
      estimatedFee,
      migrateMsg: JSON.parse(currentInput),
      onTxFailed: () => setProcessing(false),
      onTxSucceed: () => setProcessing(false),
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
  }, [address, codeId, refetch, setValue, setTab]);

  useEffect(() => {
    if (enableMigrate) {
      setSimulateError("");
      const composedMsg = address
        ? [
            composeMsg(MsgType.MIGRATE, {
              codeId: Long.fromInt(codeId),
              contract: contractAddress,
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
  }, [address, codeId, contractAddress, enableMigrate, currentInput]);

  useEffect(() => {
    if (localSchema) setTab(MessageTabs.YOUR_SCHEMA);
  }, [localSchema]);

  return (
    <>
      <Heading as="h6" mb={4} variant="h6">
        Migrate to Code ID
      </Heading>
      <CodeSelectSection
        name="codeId"
        status={status}
        codeId={codeId}
        control={control}
        error={formErrors.codeId?.message}
        onCodeSelect={(code: number) => {
          setValue("codeId", code);
          resetMsgInputSchema();
        }}
        setCodeHash={(data: Code) =>
          setValue("codeHash", data.hash.toLowerCase())
        }
      />
      <Flex align="center" justify="space-between" mb={6} mt={12}>
        <Heading as="h6" variant="h6">
          Migrate Message
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
            setText={(msg: string) =>
              setValue(`msgInput.${jsonInputFormKey}`, msg)
            }
            text={msgInput[MessageTabs.JSON_INPUT]}
          />
        }
        schemaContent={
          codeId && (
            <SchemaInputSection
              handleChange={handleChange}
              type="migrate"
              verifiedSchema={verifiedSchema}
              codeHash={codeHash}
              codeId={codeId}
              localSchema={localSchema}
              onSchemaSave={resetMsgInputSchema}
            />
          )
        }
      />
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
        alignItems="center"
        alignSelf="flex-start"
        display="flex"
        gap={1}
        color="text.dark"
        fontSize="14px"
      >
        <p>Transaction Fee:</p>
        <EstimatedFeeRender
          estimatedFee={estimatedFee}
          loading={isSimulating}
        />
      </Flex>
      <Flex justify="space-between" mt={8} w="100%">
        <Button
          variant="outline-gray"
          w="128px"
          leftIcon={<CustomIcon name="chevron-left" />}
          onClick={handleBack}
        >
          Previous
        </Button>
        <Button
          isDisabled={!enableMigrate || !estimatedFee || isSimulating}
          sx={{ pointerEvents: processing && "none" }}
          variant="primary"
          w="128px"
          isLoading={processing}
          onClick={proceed}
        >
          Migrate
        </Button>
      </Flex>
    </>
  );
};
