import { Box, Flex, Button, ButtonGroup, Text } from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";

import {
  useFabricateFee,
  useExecuteContractTx,
  useCurrentChain,
} from "lib/app-provider";
import { useAttachFunds } from "lib/app-provider/hooks/useAttachFunds";
import { useSimulateFeeQuery } from "lib/app-provider/queries";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/copy";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
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
import JsonInput from "lib/components/json/JsonInput";
import { useContractStore } from "lib/providers/store";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack, AmpTrackAction } from "lib/services/amplitude";
import type { Activity } from "lib/stores/contract";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
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

const assetDefault = {
  assetsSelect: defaultAsset,
  assetsJsonStr: defaultAssetJsonStr,
  attachFundsOption: AttachFundsType.ATTACH_FUNDS_NULL,
};

export const ExecuteArea = ({
  contractAddress,
  initialMsg,
  initialFunds,
  cmds,
}: ExecuteAreaProps) => {
  const { address } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const executeTx = useExecuteContractTx();
  const { broadcast } = useTxBroadcast();
  const { addActivity } = useContractStore();
  const getAttachFunds = useAttachFunds();
  const [fee, setFee] = useState<StdFee>();
  const [msg, setMsg] = useState(initialMsg);

  const [error, setError] = useState<string>();
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  const { control, setValue, watch, reset } = useForm<AttachFundsState>({
    mode: "all",
    defaultValues: assetDefault,
  });

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

  const { errors } = useFormState({ control });

  const { assetsJsonStr, assetsSelect, attachFundsOption } = watch();

  const isValidAssetsSelect = !errors.assetsSelect;
  const isValidAssetsJsonStr =
    !errors.assetsJsonStr && jsonValidate(assetsJsonStr) === null;

  const enableExecute = useMemo(() => {
    const generalCheck = !!(
      msg.trim().length &&
      jsonValidate(msg) === null &&
      address &&
      contractAddress
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
    contractAddress,
    attachFundsOption,
    isValidAssetsSelect,
    isValidAssetsJsonStr,
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

  const proceed = useCallback(async () => {
    const funds = getAttachFunds(
      attachFundsOption,
      assetsJsonStr,
      assetsSelect
    );
    AmpTrackAction(AmpEvent.ACTION_EXECUTE, funds.length, attachFundsOption);
    const stream = await executeTx({
      onTxSucceed: (userKey: string, activity: Activity) => {
        addActivity(userKey, activity);
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

  useEffect(() => setMsg(initialMsg), [initialMsg]);

  const assetsSelectString = JSON.stringify(assetsSelect);
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
        <Text variant="body3" mb={4}>
          Message Suggestions:
        </Text>
      )}
      {cmds.length ? (
        <ButtonGroup
          flexWrap="wrap"
          rowGap={4}
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
          <Text mt={2} variant="body2" color="text.dark">
            No ExecuteMsgs suggestion available
          </Text>
        )
      )}
      <Flex gap={8} mt={8} direction={{ sm: "column", lg: "row" }}>
        <Box w={{ sm: "full", lg: "50%" }}>
          <JsonInput topic="Execute Msg" text={msg} setText={setMsg} />
          {error && <ErrorMessageRender error={error} mb={4} />}
        </Box>
        <Box w={{ sm: "full", lg: "50%" }}>
          <AttachFund
            control={control}
            setValue={setValue}
            attachFundsOption={attachFundsOption}
          />
        </Box>
      </Flex>
      <Flex alignItems="center" justify="space-between">
        <Flex gap={2}>
          <CopyButton
            isDisable={!msg.length}
            value={msg}
            amptrackSection="execute_msg"
          />
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
            leftIcon={<CustomIcon name="execute" />}
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
