import type { Coin, StdFee } from "@cosmjs/stargate";
import type { RJSFValidationError } from "@rjsf/utils";
import type { AttachFundsState } from "lib/components/fund/types";
import type { Activity } from "lib/stores/contract";
import type {
  BechAddr32,
  ComposedMsg,
  JsonDataType,
  SchemaInfo,
} from "lib/types";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, trackActionWithFunds } from "lib/amplitude";
import {
  useCurrentChain,
  useExecuteContractTx,
  useFabricateFee,
} from "lib/app-provider";
import { useAttachFunds } from "lib/app-provider/hooks/useAttachFunds";
import { CopyButton } from "lib/components/copy";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { AttachFund } from "lib/components/fund";
import {
  ASSETS_JSON_STR,
  ATTACH_FUNDS_OPTION,
  defaultAsset,
  defaultAssetJsonStr,
} from "lib/components/fund/data";
import { AttachFundsType } from "lib/components/fund/types";
import { CustomIcon } from "lib/components/icon";
import { JsonSchemaForm } from "lib/components/json-schema";
import { useTxBroadcast } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useSimulateFeeQuery } from "lib/services/tx";
import { MsgType } from "lib/types";
import {
  composeMsg,
  getDefaultMsg,
  isNonEmptyJsonData,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";

const WasmCodeSnippet = dynamic(
  () => import("lib/components/modal/WasmCodeSnippet"),
  {
    ssr: false,
  }
);

interface ExecuteBoxProps {
  contractAddress: BechAddr32;
  initialFunds: Coin[];
  initialMsg: JsonDataType;
  msgSchema: SchemaInfo;
  opened: boolean;
}

const assetDefault = {
  assetsJsonStr: defaultAssetJsonStr,
  assetsSelect: defaultAsset,
  attachFundsOption: AttachFundsType.ATTACH_FUNDS_NULL,
};

export const ExecuteBox = ({
  contractAddress,
  initialFunds,
  initialMsg,
  msgSchema,
  opened,
}: ExecuteBoxProps) => {
  // ------------------------------------------//
  // --------------DEPENDENCIES----------------//
  // ------------------------------------------//
  const { address } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const executeTx = useExecuteContractTx();
  const { broadcast } = useTxBroadcast();
  const { addActivity } = useContractStore();
  const getAttachFunds = useAttachFunds();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [fee, setFee] = useState<StdFee>();
  const [msg, setMsg] = useState(JSON.stringify(getDefaultMsg(msgSchema)));
  const [isValidForm, setIsValidForm] = useState(false);
  const [simulateFeeError, setSimulateFeeError] = useState<string>();
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const { control, reset, setValue, watch } = useForm<AttachFundsState>({
    defaultValues: assetDefault,
    mode: "all",
  });
  const { errors: attachFundErrors } = useFormState({ control });
  const { assetsJsonStr, assetsSelect, attachFundsOption } = watch();

  // ------------------------------------------//
  // -------------------LOGICS-----------------//
  // ------------------------------------------//
  const isValidAssetsSelect = !attachFundErrors.assetsSelect;
  const isValidAssetsJsonStr =
    !attachFundErrors.assetsJsonStr && jsonValidate(assetsJsonStr) === null;

  const enableExecute = useMemo(() => {
    const generalCheck = Boolean(
      msg.trim().length &&
        jsonValidate(msg) === null &&
        address &&
        contractAddress &&
        opened &&
        isValidForm
    );
    switch (attachFundsOption) {
      case AttachFundsType.ATTACH_FUNDS_JSON:
        return generalCheck && isValidAssetsJsonStr;
      case AttachFundsType.ATTACH_FUNDS_SELECT:
        return generalCheck && isValidAssetsSelect;
      default:
        return generalCheck;
    }
  }, [
    msg,
    address,
    opened,
    isValidForm,
    contractAddress,
    attachFundsOption,
    isValidAssetsSelect,
    isValidAssetsJsonStr,
  ]);

  const assetsSelectString = JSON.stringify(assetsSelect);

  const funds = useMemo(
    () => getAttachFunds(attachFundsOption, assetsJsonStr, assetsSelect),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetsJsonStr, assetsSelectString, attachFundsOption, getAttachFunds]
  );

  // ------------------------------------------//
  // -----------------REACT QUERY--------------//
  // ------------------------------------------//
  const { isFetching } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
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

  // ------------------------------------------//
  // ------------------CALLBACKS---------------//
  // ------------------------------------------//
  const handleChange = useCallback(
    (data: unknown, errors: RJSFValidationError[]) => {
      setIsValidForm(errors.length === 0);
      setMsg(JSON.stringify(data));

      // reset fee and error when user change the input
      setSimulateFeeError(undefined);
      setFee(undefined);
    },
    []
  );

  const proceed = useCallback(async () => {
    trackActionWithFunds(
      AmpEvent.ACTION_EXECUTE,
      funds.length,
      attachFundsOption,
      "schema"
    );
    const stream = await executeTx({
      contractAddress,
      estimatedFee: fee,
      funds,
      msg: JSON.parse(msg),
      onTxFailed: () => setProcessing(false),
      onTxSucceed: (activity: Activity) => {
        addActivity(activity);
        setProcessing(false);
      },
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    executeTx,
    fee,
    contractAddress,
    msg,
    funds,
    attachFundsOption,
    addActivity,
    broadcast,
  ]);

  // ------------------------------------------//
  // ----------------SIDE EFFECTS--------------//
  // ------------------------------------------//
  /**
   * @remarks
   * Handle when there is an initialFunds
   */
  useEffect(() => {
    try {
      if (initialFunds.length) {
        setValue(ASSETS_JSON_STR, jsonPrettify(JSON.stringify(initialFunds)));
        setValue(ATTACH_FUNDS_OPTION, AttachFundsType.ATTACH_FUNDS_JSON);
      } else {
        reset(assetDefault);
      }
    } catch {
      // comment just to avoid eslint no-empty
    }
  }, [initialFunds, reset, setValue]);

  /**
   * @remarks
   * Handle when there is an initialMsg
   */
  useEffect(() => {
    if (isNonEmptyJsonData(initialMsg)) setMsg(JSON.stringify(initialMsg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialMsg)]);

  useEffect(() => {
    if (enableExecute) {
      const composedMsg = address
        ? [
            composeMsg(MsgType.EXECUTE, {
              contract: contractAddress,
              funds,
              msg: Uint8Array.from(Buffer.from(msg)),
              sender: address,
            }),
          ]
        : [];

      const timeoutId = setTimeout(() => {
        setComposedTxMsg(composedMsg);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }

    // reset when enableExecute is false
    setComposedTxMsg([]);
    setFee(undefined);

    return () => {};
  }, [address, contractAddress, enableExecute, msg, funds]);

  return (
    <AccordionItem className={`execute_msg_${msgSchema.schema.required?.[0]}`}>
      <h6>
        <AccordionButton p={4}>
          <Box textAlign="start" w="full">
            <Text fontWeight={700} variant="body1">
              {msgSchema.title}
            </Text>
            <Text textColor="text.dark" variant="body3">
              {msgSchema.description}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Grid columnGap={6} templateColumns="1fr 1fr" templateRows="auto auto">
          <GridItem>
            <Text color="text.dark" fontWeight={700} variant="body2">
              Execute Input
            </Text>
            <JsonSchemaForm
              formId={`execute-${msgSchema.title}`}
              initialFormData={initialMsg}
              schema={msgSchema.schema}
              onChange={handleChange}
            />
            {simulateFeeError && (
              <Alert alignItems="center" mb={3} variant="error">
                <AlertDescription wordBreak="break-word">
                  {simulateFeeError}
                </AlertDescription>
              </Alert>
            )}
          </GridItem>
          <GridItem>
            <Text color="text.dark" fontWeight={700} pb={3} variant="body2">
              Attach Funds
            </Text>
            <AttachFund
              attachFundsOption={attachFundsOption}
              control={control}
              setValue={setValue}
              showLabel={false}
            />
          </GridItem>
          <GridItem>
            <Flex gap={2} justify="flex-start">
              <CopyButton
                amptrackSection="execute_msg"
                buttonText="Copy JSON"
                isDisable={msg === ""}
                value={msg}
              />
              <WasmCodeSnippet
                contractAddress={contractAddress}
                funds={funds}
                message={msg}
                type="execute"
              />
            </Flex>
          </GridItem>
          <GridItem>
            <Flex
              align="center"
              direction="row"
              gap={2}
              justifyContent="space-between"
            >
              <Flex alignItems="center" color="text.dark" fontSize="14px">
                Transaction fee:{" "}
                <EstimatedFeeRender estimatedFee={fee} loading={isFetching} />
              </Flex>
              <Button
                fontSize="14px"
                isDisabled={!enableExecute || !fee || isFetching}
                isLoading={processing}
                leftIcon={<CustomIcon name="execute" />}
                p="6px 16px"
                sx={{ pointerEvents: processing && "none" }}
                variant="primary"
                onClick={proceed}
              >
                Execute
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};
