import { Box, Flex, Button, ButtonGroup, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormState, useWatch } from "react-hook-form";
import type { Control, UseFormSetValue } from "react-hook-form";
import { MdInput } from "react-icons/md";

import type { ExecutePageState } from "../types";
import {
  useFabricateFee,
  useNativeTokensInfo,
  useExecuteContractTx,
} from "lib/app-provider";
import { useSimulateFeeQuery } from "lib/app-provider/queries";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/CopyButton";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { AssetInput, ControllerInput } from "lib/components/forms";
import JsonInput from "lib/components/json/JsonInput";
import { useContractStore } from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Activity } from "lib/stores/contract";
import type { ComposedMsg, ContractAddr, HumanAddr, Token } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, jsonPrettify, jsonValidate, microfy } from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface ExecuteAreaProps {
  control: Control<ExecutePageState>;
  setValue: UseFormSetValue<ExecutePageState>;
  cmds: [string, string][];
}

export const ExecuteArea = ({ control, setValue, cmds }: ExecuteAreaProps) => {
  const { address } = useWallet();
  const fabricateFee = useFabricateFee();
  const executeTx = useExecuteContractTx();
  const { broadcast } = useTxBroadcast();
  const { addActivity } = useContractStore();
  const nativeTokensInfo = useNativeTokensInfo();

  const [contractAddress, initialMsg, assets] = useWatch({
    control,
    name: ["contractAddress", "initialMsg", "assets"],
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });
  const { errors } = useFormState({ control });

  const selectedAssets = assets.map((asset) => asset.denom);

  const assetOptions = useMemo(
    () =>
      nativeTokensInfo.map((asset) => ({
        label: asset.symbol,
        value: asset.base,
        disabled: selectedAssets.includes(asset.base),
      })),
    [nativeTokensInfo, selectedAssets]
  );

  const [fee, setFee] = useState<StdFee>();
  const [msg, setMsg] = useState(initialMsg);
  const [error, setError] = useState<string>();
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  const enableExecute =
    !!(
      msg.trim().length &&
      jsonValidate(msg) === null &&
      address &&
      contractAddress
    ) && !errors.assets;

  const { isFetching } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
    onSuccess: (gasRes) => {
      if (gasRes) setFee(fabricateFee(gasRes));
      else setFee(undefined);
    },
    onError: (e) => {
      setError(e.message);
      setFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    AmpTrack(AmpEvent.ACTION_EXECUTE);
    const funds = assets
      .filter((asset) => asset.amount && asset.denom)
      .map((asset) => ({
        ...asset,
        amount: microfy(asset.amount as Token).toFixed(0),
      }));

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
  }, [contractAddress, fee, msg, assets, addActivity, executeTx, broadcast]);

  useEffect(() => setMsg(initialMsg), [initialMsg]);

  useEffect(() => {
    if (enableExecute) {
      setError(undefined);

      const funds = assets
        .filter((asset) => asset.amount && asset.denom)
        .map((asset) => ({
          ...asset,
          amount: microfy(asset.amount as Token).toFixed(0),
        }))
        .filter((asset) => asset.amount !== "0");

      const composedMsg = composeMsg(MsgType.EXECUTE, {
        sender: address as HumanAddr,
        contract: contractAddress as ContractAddr,
        msg: Buffer.from(msg),
        funds,
      });
      const timeoutId = setTimeout(() => {
        setComposedTxMsg([composedMsg]);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [address, contractAddress, enableExecute, msg, assets]);

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
    <Box>
      {cmds.length ? (
        <ButtonGroup
          flexWrap="wrap"
          rowGap="8px"
          mt={8}
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
          <Text m="16px" variant="body2" color="text.dark">
            No ExecuteMsgs suggestion available
          </Text>
        )
      )}
      <Flex gap="32px" mt={8} direction={{ sm: "column", xl: "row" }}>
        <Box w={{ sm: "full", xl: "70%" }}>
          <Text variant="body1" fontWeight="600" mb={4}>
            Execute Messages
          </Text>
          <JsonInput
            topic="Execute Msg"
            text={msg}
            setText={setMsg}
            height="240px"
          />
          {error && <ErrorMessageRender error={error} mb={4} />}
        </Box>
        <Box w={{ sm: "full", xl: "50%" }}>
          <Text variant="body1" fontWeight="600" mb={4}>
            Send Assets
          </Text>
          {fields.map((field, idx) => (
            <AssetInput
              key={field.id}
              disableDelete={fields.length <= 1}
              onDelete={() => remove(idx)}
              setCurrencyValue={(newVal: string) =>
                setValue(`assets.${idx}.denom`, newVal)
              }
              assetOptions={assetOptions}
              initialSelected={field.denom}
              amountInput={
                <ControllerInput
                  name={`assets.${idx}.amount`}
                  control={control}
                  label="Amount"
                  variant="floating"
                  type="number"
                  rules={{
                    pattern: {
                      // Move to constant
                      value: /^[0-9]+([.][0-9]{0,6})?$/i,
                      message: 'Invalid amount. e.g. "100.00"',
                    },
                  }}
                  error={errors.assets?.[idx]?.amount?.message}
                />
              }
            />
          ))}
          <Button
            variant="outline-primary"
            mt="32px"
            mx="auto"
            onClick={() => append({ denom: "", amount: "" })}
            disabled={assetOptions.length === selectedAssets.length}
          >
            Add More Asset
          </Button>
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
