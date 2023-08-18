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
import type { StdFee } from "@cosmjs/stargate";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";

import {
  useCurrentChain,
  useExecuteContractTx,
  useFabricateFee,
  useSimulateFeeQuery,
} from "lib/app-provider";
import { useAttachFunds } from "lib/app-provider/hooks/useAttachFunds";
import { CopyButton } from "lib/components/copy";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { AttachFund } from "lib/components/fund";
import { defaultAsset, defaultAssetJsonStr } from "lib/components/fund/data";
import type { AttachFundsState } from "lib/components/fund/types";
import { AttachFundsType } from "lib/components/fund/types";
import { CustomIcon } from "lib/components/icon";
import { JsonSchemaForm } from "lib/components/json-schema";
import { useContractStore } from "lib/providers/store";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrackAction } from "lib/services/amplitude";
import type { Activity } from "lib/stores/contract";
import type { QueryExecuteSchema } from "lib/stores/schema";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, jsonValidate } from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface ExecuteBoxProps {
  msgSchema: QueryExecuteSchema;
  contractAddress: ContractAddr;
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
  // TODO: add initial msg
  const [msg, setMsg] = useState("{}");
  const [error, setError] = useState<string>();
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const { control, setValue, watch } = useForm<AttachFundsState>({
    mode: "all",
    defaultValues: assetDefault,
  });
  const { errors } = useFormState({ control });
  const { assetsJsonStr, assetsSelect, attachFundsOption } = watch();

  // ------------------------------------------//
  // -------------------LOGICS-----------------//
  // ------------------------------------------//
  const isValidAssetsSelect = !errors.assetsSelect;
  const isValidAssetsJsonStr =
    !errors.assetsJsonStr && jsonValidate(assetsJsonStr) === null;

  const assetsSelectString = JSON.stringify(assetsSelect);

  const enableExecute = useMemo(() => {
    const generalCheck = !!(
      msg.trim().length &&
      jsonValidate(msg) === null &&
      address &&
      contractAddress &&
      opened
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
    contractAddress,
    attachFundsOption,
    isValidAssetsSelect,
    isValidAssetsJsonStr,
  ]);

  // ------------------------------------------//
  // -----------------REACT QUERY--------------//
  // ------------------------------------------//
  const { isFetching } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
    onSuccess: (gasRes) => {
      setError(undefined);
      if (gasRes) setFee(fabricateFee(gasRes));
      else setFee(undefined);
    },
    onError: (e) => {
      setError(e.message);
      setFee(undefined);
    },
  });

  // ------------------------------------------//
  // ------------------CALLBACKS---------------//
  // ------------------------------------------//

  const proceed = useCallback(async () => {
    const funds = getAttachFunds(
      attachFundsOption,
      assetsJsonStr,
      assetsSelect
    );
    AmpTrackAction(AmpEvent.ACTION_EXECUTE, funds.length, attachFundsOption);
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
    attachFundsOption,
    executeTx,
    fee,
    contractAddress,
    msg,
    getAttachFunds,
    assetsJsonStr,
    assetsSelect,
    addActivity,
    broadcast,
  ]);

  // ------------------------------------------//
  // ----------------SIDE EFFECTS--------------//
  // ------------------------------------------//
  useEffect(() => {
    if (enableExecute) {
      const composedMsg = composeMsg(MsgType.EXECUTE, {
        sender: address as HumanAddr,
        contract: contractAddress as ContractAddr,
        msg: Buffer.from(msg),
        funds: getAttachFunds(attachFundsOption, assetsJsonStr, assetsSelect),
      });

      const timeoutId = setTimeout(() => {
        setComposedTxMsg([composedMsg]);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [
    address,
    contractAddress,
    enableExecute,
    msg,
    assetsJsonStr,
    assetsSelectString,
    getAttachFunds,
    attachFundsOption,
    assetsSelect,
  ]);

  return (
    <AccordionItem p={4}>
      <h6>
        <AccordionButton>
          <Box w="full" textAlign="start">
            <Text variant="body1" fontWeight={700}>
              {msgSchema.title}
            </Text>
            <Text variant="body1">{msgSchema.description}</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel p="16px 0 0 0">
        <Grid templateColumns="1fr 1fr" templateRows="auto auto" columnGap={6}>
          <GridItem>
            <JsonSchemaForm
              formId={`execute-${msgSchema.title}`}
              schema={msgSchema.schema}
              onChange={(data) => setMsg(JSON.stringify(data))}
            />
            {error && (
              <Alert variant="error" mb={3} alignItems="center">
                <AlertDescription wordBreak="break-word">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </GridItem>
          <GridItem pt={5}>
            <AttachFund
              control={control}
              setValue={setValue}
              attachFundsOption={attachFundsOption}
            />
          </GridItem>
          <GridItem>
            <Flex gap={2} justify="flex-start">
              <CopyButton
                value={msg}
                amptrackSection="execute_msg"
                buttonText="Copy JSON"
              />
              <CodeSnippet
                type="query"
                contractAddress={contractAddress}
                message={msg}
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
                Transaction Fee:{" "}
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
