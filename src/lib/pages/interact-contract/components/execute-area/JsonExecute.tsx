import type { Coin, StdFee } from "@cosmjs/stargate";
import type { AttachFundsState } from "lib/components/fund/types";
import type { Activity } from "lib/stores/contract";
import type { BechAddr32, ComposedMsg } from "lib/types";

import { Box, Flex } from "@chakra-ui/react";
import { AmpEvent, trackActionWithFunds } from "lib/amplitude";
import {
  useCurrentChain,
  useExecuteContractTx,
  useFabricateFee,
} from "lib/app-provider";
import { useAttachFunds } from "lib/app-provider/hooks/useAttachFunds";
import { SubmitButton } from "lib/components/button";
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
import { AttachFundsType } from "lib/components/fund/types";
import JsonInput from "lib/components/json/JsonInput";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { useExecuteCmds, useTxBroadcast } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useSimulateFeeQuery } from "lib/services/tx";
import { MsgType } from "lib/types";
import { composeMsg, jsonPrettify, jsonValidate } from "lib/utils";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";

import { MsgSuggestion } from "./MsgSuggestion";

interface JsonExecuteProps {
  contractAddress: BechAddr32;
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
  assetsJsonStr: defaultAssetJsonStr,
  assetsSelect: defaultAsset,
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
  const [msg, setMsg] = useState(initialMsg);
  const [error, setError] = useState<string>();
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const { control, reset, setValue, watch } = useForm<AttachFundsState>({
    defaultValues: assetDefault,
    mode: "all",
  });
  const { errors } = useFormState({ control });
  const { assetsJsonStr, assetsSelect, attachFundsOption } = watch();

  // ------------------------------------------//
  // -------------------LOGICS-----------------//
  // ------------------------------------------//
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

  const assetsSelectString = JSON.stringify(assetsSelect);

  const funds = useMemo(
    () => getAttachFunds(attachFundsOption, assetsJsonStr, assetsSelect),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetsJsonStr, assetsSelectString, attachFundsOption, getAttachFunds]
  );

  // ------------------------------------------//
  // -----------------REACT QUERY--------------//
  // ------------------------------------------//
  const { execCmds, isFetching: cmdsFetching } =
    useExecuteCmds(contractAddress);
  const { isFetching } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
    onError: (e) => {
      setError(e.message);
      setFee(undefined);
    },
    onSuccess: (gasRes) => {
      setError(undefined);
      if (gasRes) setFee(fabricateFee(gasRes));
      else setFee(undefined);
    },
  });

  // ------------------------------------------//
  // ------------------CALLBACKS---------------//
  // ------------------------------------------//

  const proceed = useCallback(async () => {
    trackActionWithFunds(
      AmpEvent.ACTION_EXECUTE,
      funds.length,
      attachFundsOption,
      "json-input"
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
    attachFundsOption,
    executeTx,
    fee,
    contractAddress,
    msg,
    funds,
    addActivity,
    broadcast,
  ]);

  // ------------------------------------------//
  // ----------------SIDE EFFECTS--------------//
  // ------------------------------------------//
  useEffect(() => setMsg(initialMsg), [contractAddress, initialMsg]);

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

  useEffect(() => {
    if (enableExecute) {
      const composedMsg = address
        ? [
            composeMsg(MsgType.EXECUTE, {
              contract: contractAddress,
              funds,
              msg: Buffer.from(msg),
              sender: address,
            }),
          ]
        : [];

      const timeoutId = setTimeout(() => {
        setComposedTxMsg(composedMsg);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [address, contractAddress, enableExecute, funds, msg]);

  const isButtonDisabled = !enableExecute || !fee || isFetching;
  return (
    <>
      {cmdsFetching && <LoadingOverlay />}
      <MsgSuggestion
        cmds={execCmds}
        contractAddress={contractAddress}
        setMsg={setMsg}
      />
      <Flex direction="column" gap={10}>
        <Flex direction={{ lg: "row", sm: "column" }} gap={8}>
          <Flex direction="column" w={{ lg: "50%", sm: "full" }}>
            <JsonInput setText={setMsg} text={msg} topic="Execute msg" />
            {error && <ErrorMessageRender error={error} mb={4} />}
          </Flex>
          <Box w={{ lg: "50%", sm: "full" }}>
            <AttachFund
              attachFundsOption={attachFundsOption}
              control={control}
              setValue={setValue}
            />
          </Box>
        </Flex>
        <Flex alignItems="center" justify="space-between">
          <Flex gap={2}>
            <CopyButton
              amptrackSection="execute_msg"
              isDisable={!msg.length}
              value={msg}
            />
            <WasmCodeSnippet
              contractAddress={contractAddress}
              funds={funds}
              message={msg}
              type="execute"
            />
          </Flex>
          <Flex align="center" direction="row" gap={2}>
            <Flex alignItems="center" color="text.dark" fontSize="14px">
              Transaction fee:{" "}
              <EstimatedFeeRender estimatedFee={fee} loading={isFetching} />
            </Flex>
            <SubmitButton
              isDisabled={isButtonDisabled}
              isLoading={processing}
              text="Execute"
              onSubmit={proceed}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
