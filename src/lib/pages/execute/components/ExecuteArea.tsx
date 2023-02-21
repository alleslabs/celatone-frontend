import { Box, Flex, Button, ButtonGroup, Text } from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { MdInput } from "react-icons/md";

import { useFabricateFee, useExecuteContractTx } from "lib/app-provider";
import { useSimulateFeeQuery } from "lib/app-provider/queries";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/CopyButton";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { AttachFund } from "lib/components/fund";
import JsonInput from "lib/components/json/JsonInput";
import { useAttachFunds, useContractStore } from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack, AmpTrackAction } from "lib/services/amplitude";
import type { Activity } from "lib/stores/contract";
import type {
  AttachFundsState,
  ComposedMsg,
  ContractAddr,
  HumanAddr,
} from "lib/types";
import { AttachFundsType, MsgType } from "lib/types";
import { composeMsg, jsonPrettify, jsonValidate } from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface ExecuteAreaProps {
  contractAddress: ContractAddr;
  initialMsg: string;
  initialFunds: Coin[];
  cmds: [string, string][];
}

export const ExecuteArea = ({
  contractAddress,
  initialMsg,
  initialFunds,
  cmds,
}: ExecuteAreaProps) => {
  const { address } = useWallet();
  const fabricateFee = useFabricateFee();
  const executeTx = useExecuteContractTx();
  const { broadcast } = useTxBroadcast();
  const { addActivity } = useContractStore();
  const [fee, setFee] = useState<StdFee>();
  const [msg, setMsg] = useState(initialMsg);

  const [error, setError] = useState<string>();
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  const assetDefault = useMemo(
    () => ({
      assetsSelect: [{ denom: "", amount: "" }] as Coin[],
      assetsJson: jsonPrettify(`[{ "denom": "", "amount": "" }]`),
      attachFundOption: AttachFundsType.ATTACH_FUNDS_NULL,
    }),
    []
  );

  const { control, setValue, watch, reset } = useForm<AttachFundsState>({
    mode: "all",
    defaultValues: assetDefault,
  });

  /**
   * @remarks
   * Handle when there is an initialFunds
   */
  useEffect(() => {
    if (initialFunds.length) {
      setValue("assetsJson", jsonPrettify(JSON.stringify(initialFunds)));
      setValue("attachFundOption", AttachFundsType.ATTACH_FUNDS_JSON);
    } else {
      reset(assetDefault);
    }
  }, [assetDefault, initialFunds, reset, setValue]);

  const { errors } = useFormState({ control });

  const { assetsJson, assetsSelect, attachFundOption } = watch();

  const validateAssetsSelect = !errors.assetsSelect;
  const validateAssetsJson =
    !errors.assetsJson && jsonValidate(assetsJson) === null;

  const enableExecute = useMemo(() => {
    const generalCheck = !!(
      msg.trim().length &&
      jsonValidate(msg) === null &&
      address &&
      contractAddress
    );
    if (attachFundOption === AttachFundsType.ATTACH_FUNDS_SELECT) {
      return generalCheck && validateAssetsSelect;
    }
    if (attachFundOption === AttachFundsType.ATTACH_FUNDS_JSON) {
      return generalCheck && validateAssetsJson;
    }
    return generalCheck;
  }, [
    address,
    attachFundOption,
    contractAddress,
    msg,
    validateAssetsJson,
    validateAssetsSelect,
  ]);

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

  const funds = useAttachFunds({
    attachFundOption,
    assetsJson,
    assetsSelect,
  });

  const proceed = useCallback(async () => {
    AmpTrackAction(AmpEvent.ACTION_EXECUTE, funds.length, attachFundOption);
    const stream = await executeTx({
      onTxSucceed: (userKey: string, activity: Activity) => {
        addActivity(userKey, activity);
        setProcessing(false);
      },
      onTxFailed: () => setProcessing(false),
      estimatedFee: fee,
      contractAddress,
      msg: JSON.parse(msg),
      funds: funds(),
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    funds,
    executeTx,
    fee,
    contractAddress,
    msg,
    attachFundOption,
    addActivity,
    broadcast,
  ]);

  useEffect(() => setMsg(initialMsg), [initialMsg]);

  const assetsSelectString = JSON.stringify(assetsSelect);
  useEffect(() => {
    if (enableExecute) {
      const composedMsg = composeMsg(MsgType.EXECUTE, {
        sender: address as HumanAddr,
        contract: contractAddress as ContractAddr,
        msg: Buffer.from(msg),
        funds: funds(),
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
    funds,
    assetsJson,
    assetsSelectString,
  ]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      // TODO: problem with safari if focusing in the textarea
      if (e.ctrlKey && e.key === "Enter") {
        proceed();
      }
    };
    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  return (
    <Box my={4}>
      {contractAddress && (
        <Text variant="body3" mb="8px">
          Message Suggestions:
        </Text>
      )}
      {cmds.length ? (
        <ButtonGroup
          flexWrap="wrap"
          rowGap="8px"
          sx={{
            "> button": {
              marginInlineStart: "0 !important",
              marginInlineEnd: "1",
            },
          }}
        >
          {cmds.sort().map(([cmd, queryMsg]) => (
            <ContractCmdButton
              key={`query-cmd-${cmd}`}
              cmd={cmd}
              onClickCmd={() => {
                AmpTrack(AmpEvent.USE_CMD_EXECUTE);
                setMsg(jsonPrettify(queryMsg));
              }}
            />
          ))}
        </ButtonGroup>
      ) : (
        contractAddress && (
          <Text mt="8px" variant="body2" color="text.dark">
            No ExecuteMsgs suggestion available
          </Text>
        )
      )}
      <Flex gap="32px" mt={8} direction={{ sm: "column", lg: "row" }}>
        <Box w={{ sm: "full", lg: "50%" }}>
          <JsonInput
            topic="Execute Msg"
            text={msg}
            setText={setMsg}
            height="240px"
          />
          {error && <ErrorMessageRender error={error} mb={4} />}
        </Box>
        <Box w={{ sm: "full", lg: "50%" }}>
          <AttachFund
            control={control}
            setValue={setValue}
            attachFundOption={attachFundOption}
          />
        </Box>
      </Flex>
      <Flex alignItems="center" justify="space-between">
        <Flex gap={2}>
          <CopyButton isDisable={!msg.length} value={msg} />
          <CodeSnippet
            type="execute"
            contractAddress={contractAddress}
            message={msg}
          />
        </Flex>
        <Flex direction="row" align="center" gap={2}>
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
            leftIcon={<MdInput />}
            isLoading={processing}
            sx={{ pointerEvents: processing && "none" }}
          >
            Execute (Ctrl + Enter)
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
