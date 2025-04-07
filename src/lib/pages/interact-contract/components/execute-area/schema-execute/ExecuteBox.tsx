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
import type { Coin, StdFee } from "@cosmjs/stargate";
import type { RJSFValidationError } from "@rjsf/utils";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";

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
import type { AttachFundsState } from "lib/components/fund/types";
import { AttachFundsType } from "lib/components/fund/types";
import { CustomIcon } from "lib/components/icon";
import { JsonSchemaForm } from "lib/components/json-schema";
import { useTxBroadcast } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useSimulateFeeQuery } from "lib/services/tx";
import type { Activity } from "lib/stores/contract";
import type {
  BechAddr32,
  ComposedMsg,
  JsonDataType,
  SchemaInfo,
} from "lib/types";
import { MsgType } from "lib/types";
import {
  composeMsg,
  getDefaultMsg,
  isNonEmptyJsonData,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";

const WasmCodeSnippet = dynamic(
  () => import("lib/components/modal/WasmCodeSnippet"),
  {
    ssr: false,
  }
);

interface ExecuteBoxProps {
  msgSchema: SchemaInfo;
  contractAddress: BechAddr32;
  initialMsg: JsonDataType;
  initialFunds: Coin[];
  opened: boolean;
}

const assetDefault = {
  assetsSelect: defaultAsset,
  assetsJsonStr: defaultAssetJsonStr,
  attachFundsOption: AttachFundsType.ATTACH_FUNDS_NULL,
};

export const ExecuteBox = ({
  msgSchema,
  contractAddress,
  initialMsg,
  initialFunds,
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
  const { control, setValue, watch, reset } = useForm<AttachFundsState>({
    mode: "all",
    defaultValues: assetDefault,
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
      case AttachFundsType.ATTACH_FUNDS_SELECT:
        return generalCheck && isValidAssetsSelect;
      case AttachFundsType.ATTACH_FUNDS_JSON:
        return generalCheck && isValidAssetsJsonStr;
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
      onTxSucceed: (activity: Activity) => {
        addActivity(activity);
        setProcessing(false);
      },
      onTxFailed: () => setProcessing(false),
      estimatedFee: fee,
      contractAddress,
      msg: JSON.parse(msg),
      funds,
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
              sender: address,
              contract: contractAddress,
              msg: Uint8Array.from(Buffer.from(msg)),
              funds,
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
          <Box w="full" textAlign="start">
            <Text variant="body1" fontWeight={700}>
              {msgSchema.title}
            </Text>
            <Text variant="body3" textColor="text.dark">
              {msgSchema.description}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Grid templateColumns="1fr 1fr" templateRows="auto auto" columnGap={6}>
          <GridItem>
            <Text variant="body2" color="text.dark" fontWeight={700}>
              Execute Input
            </Text>
            <JsonSchemaForm
              formId={`execute-${msgSchema.title}`}
              schema={msgSchema.schema}
              initialFormData={initialMsg}
              onChange={handleChange}
            />
            {simulateFeeError && (
              <Alert variant="error" mb={3} alignItems="center">
                <AlertDescription wordBreak="break-word">
                  {simulateFeeError}
                </AlertDescription>
              </Alert>
            )}
          </GridItem>
          <GridItem>
            <Text variant="body2" color="text.dark" fontWeight={700} pb={3}>
              Attach Funds
            </Text>
            <AttachFund
              control={control}
              setValue={setValue}
              attachFundsOption={attachFundsOption}
              showLabel={false}
            />
          </GridItem>
          <GridItem>
            <Flex gap={2} justify="flex-start">
              <CopyButton
                isDisable={msg === ""}
                value={msg}
                amptrackSection="execute_msg"
                buttonText="Copy JSON"
              />
              <WasmCodeSnippet
                type="execute"
                contractAddress={contractAddress}
                message={msg}
                funds={funds}
              />
            </Flex>
          </GridItem>
          <GridItem>
            <Flex
              direction="row"
              align="center"
              gap={2}
              justifyContent="space-between"
            >
              <Flex fontSize="14px" color="text.dark" alignItems="center">
                Transaction fee:{" "}
                <EstimatedFeeRender estimatedFee={fee} loading={isFetching} />
              </Flex>
              <Button
                variant="primary"
                fontSize="14px"
                p="6px 16px"
                onClick={proceed}
                isDisabled={!enableExecute || !fee || isFetching}
                leftIcon={<CustomIcon name="execute" />}
                isLoading={processing}
                sx={{ pointerEvents: processing && "none" }}
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
