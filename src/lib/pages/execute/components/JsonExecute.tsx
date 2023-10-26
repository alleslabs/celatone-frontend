import { Box, Flex, Button } from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";

import { AmpEvent, useTrack } from "lib/amplitude";
import {
  useFabricateFee,
  useExecuteContractTx,
  useCurrentChain,
  useMobile,
  useIsMac,
} from "lib/app-provider";
import { useAttachFunds } from "lib/app-provider/hooks/useAttachFunds";
import { useSimulateFeeQuery } from "lib/app-provider/queries";
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
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { useExecuteCmds } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { Activity } from "lib/stores/contract";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, jsonPrettify, jsonValidate } from "lib/utils";

import { MsgSuggestion } from "./MsgSuggestion";

interface JsonExecuteProps {
  contractAddress: ContractAddr;
  initialMsg: string;
  initialFunds: Coin[];
}

const WasmCodeSnippet = dynamic(
  () => import("lib/components/modal/WasmCodeSnippet"),
  {
    ssr: false,
  }
);

const assetDefault = {
  assetsSelect: defaultAsset,
  assetsJsonStr: defaultAssetJsonStr,
  attachFundsOption: AttachFundsType.ATTACH_FUNDS_NULL,
};

export const JsonExecute = ({
  contractAddress,
  initialFunds,
  initialMsg,
}: JsonExecuteProps) => {
  // ------------------------------------------//
  // --------------DEPENDENCIES----------------//
  // ------------------------------------------//
  const isMobile = useMobile();
  const isMac = useIsMac();
  const { address } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const executeTx = useExecuteContractTx();
  const { broadcast } = useTxBroadcast();
  const { addActivity } = useContractStore();
  const getAttachFunds = useAttachFunds();
  const { trackActionWithFunds } = useTrack();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [fee, setFee] = useState<StdFee>();
  const [msg, setMsg] = useState(initialMsg);
  const [error, setError] = useState<string>();
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const { control, setValue, watch, reset } = useForm<AttachFundsState>({
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

  // ------------------------------------------//
  // -----------------REACT QUERY--------------//
  // ------------------------------------------//
  const { isFetching: cmdsFetching, execCmds } = useExecuteCmds(
    contractAddress as ContractAddr
  );
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
    trackActionWithFunds(
      AmpEvent.ACTION_EXECUTE,
      funds.length,
      attachFundsOption,
      "json-input"
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
    attachFundsOption,
    executeTx,
    fee,
    contractAddress,
    msg,
    getAttachFunds,
    trackActionWithFunds,
    assetsJsonStr,
    assetsSelect,
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

  useEffect(() => setMsg(initialMsg), [initialMsg]);

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

  const isButtonDisabled = !enableExecute || !fee || isFetching;
  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      // TODO: problem with safari if focusing in the textarea
      const specialKey = isMac ? e.metaKey : e.ctrlKey;
      if (!isButtonDisabled && specialKey && e.key === "Enter") {
        proceed();
      }
    };
    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  return (
    <>
      {cmdsFetching && <LoadingOverlay />}
      <MsgSuggestion
        contractAddress={contractAddress}
        cmds={execCmds}
        setMsg={setMsg}
      />
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
          <WasmCodeSnippet
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
            isDisabled={isButtonDisabled}
            leftIcon={<CustomIcon name="execute" />}
            isLoading={processing}
            sx={{ pointerEvents: processing && "none" }}
          >
            Execute {!isMobile && ` (${isMac ? "⌘" : "Ctrl"} + Enter)`}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
