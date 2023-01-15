import { Box, Flex, Button, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { MdInput } from "react-icons/md";

import { useFabricateFee } from "lib/app-provider";
import { useSimulateFeeQuery } from "lib/app-provider/queries";
import { useExecuteContractTx } from "lib/app-provider/tx/execute";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CopyButton } from "lib/components/CopyButton";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import JsonInput from "lib/components/json/JsonInput";
import { CodeSnippet } from "lib/components/modal/CodeSnippet";
import { useContractStore } from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { Activity } from "lib/stores/contract";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, jsonPrettify, jsonValidate } from "lib/utils";

interface ExecuteAreaProps {
  contractAddress: ContractAddr;
  initialMsg: string;
  cmds: [string, string][];
}

export const ExecuteArea = ({
  contractAddress,
  initialMsg,
  cmds,
}: ExecuteAreaProps) => {
  const { address = "" } = useWallet();
  const fabricateFee = useFabricateFee();
  const executeTx = useExecuteContractTx();
  const { broadcast } = useTxBroadcast();
  const { addActivity } = useContractStore();

  const [fee, setFee] = useState<StdFee>();
  const [msg, setMsg] = useState(initialMsg);
  const [error, setError] = useState("");
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [processing, setProcessing] = useState(false);

  const enableExecute = !!(
    msg.trim().length &&
    jsonValidate(msg) === null &&
    address &&
    contractAddress
  );

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
    const stream = await executeTx({
      onTxSucceed: (userKey: string, activity: Activity) => {
        addActivity(userKey, activity);
        setProcessing(false);
      },
      onTxFailed: () => setProcessing(false),
      estimatedFee: fee,
      contractAddress,
      msg: JSON.parse(msg),
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [contractAddress, fee, msg, addActivity, executeTx, broadcast]);

  useEffect(() => setMsg(initialMsg), [initialMsg]);

  useEffect(() => {
    if (enableExecute) {
      setError("");
      const composedMsg = composeMsg(MsgType.EXECUTE, {
        sender: address as HumanAddr,
        contract: contractAddress as ContractAddr,
        msg: Buffer.from(msg),
        funds: [],
      });
      const timeoutId = setTimeout(() => {
        setComposedTxMsg([composedMsg]);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [address, contractAddress, enableExecute, msg]);

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
    <Box w="full">
      {cmds.length ? (
        <ButtonGroup
          flexWrap="wrap"
          rowGap="8px"
          mb="16px"
          sx={{
            "> button": {
              marginInlineStart: "0 !important",
              marginInlineEnd: "1",
            },
          }}
        >
          {cmds.map(([cmd, queryMsg]) => (
            <ContractCmdButton
              key={`query-cmd-${cmd}`}
              cmd={cmd}
              onClickCmd={() => setMsg(jsonPrettify(queryMsg))}
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
      <JsonInput
        topic="Execute Msg"
        text={msg}
        setText={setMsg}
        height="240px"
      />
      {error && (
        <Flex gap={2} mb={4}>
          <Icon as={IoIosWarning} boxSize={4} color="error.main" />
          <Text variant="body3" color="error.main">
            {error}
          </Text>
        </Flex>
      )}
      <Flex alignItems="center" justify="space-between">
        <Flex gap={2}>
          <CopyButton isDisable={msg.length === 0} value={msg} />
          <CodeSnippet
            type="execute"
            contractAddress={contractAddress}
            message={msg}
            isDisable={!contractAddress || msg.length === 0}
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
