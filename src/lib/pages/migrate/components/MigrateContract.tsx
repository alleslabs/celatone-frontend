import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import Long from "long";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useFabricateFee,
  useSimulateFeeQuery,
  useCurrentChain,
} from "lib/app-provider";
import { useMigrateTx } from "lib/app-provider/tx/migrate";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { FormStatus } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import JsonInput from "lib/components/json/JsonInput";
import { CodeSelectSection } from "lib/components/select-code";
import { Tooltip } from "lib/components/Tooltip";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { CodeIdInfoResponse } from "lib/services/code";
import { useLCDCodeInfo } from "lib/services/codeService";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, jsonValidate, resolvePermission } from "lib/utils";

import { MessageInputSwitch } from "./MessageInputSwitch";
import { SchemaSection } from "./SchemaSection";

interface MigrateContractProps {
  contractAddress: ContractAddr;
  codeIdParam: string;
  handleBack: () => void;
}

enum MessageTabs {
  JSON_INPUT = "JSON Input",
  YOUR_SCHEMA = "Your Schema",
}

const resolveTabDisplay = (
  current: MessageTabs,
  target: MessageTabs
): BoxProps["display"] => {
  return current === target ? "block" : "none";
};

export const MigrateContract = observer(
  ({ contractAddress, codeIdParam, handleBack }: MigrateContractProps) => {
    const { address } = useCurrentChain();
    const { broadcast } = useTxBroadcast();
    const migrateTx = useMigrateTx();
    const fabricateFee = useFabricateFee();

    const {
      control,
      watch,
      setValue,
      formState: { errors },
    } = useForm({
      defaultValues: {
        codeId: codeIdParam,
        codeHash: "",
        msgInput: {
          [MessageTabs.JSON_INPUT]: "{}",
          [MessageTabs.YOUR_SCHEMA]: "{}",
        },
      },
      mode: "all",
    });
    const { codeId, codeHash, msgInput } = watch();
    const [tab, setTab] = useState(MessageTabs.JSON_INPUT);
    const [status, setStatus] = useState<FormStatus>({ state: "init" });
    const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
    const [estimatedFee, setEstimatedFee] = useState<StdFee>();
    const [simulateError, setSimulateError] = useState("");
    const [processing, setProcessing] = useState(false);

    const currentInput = msgInput[tab];

    const enableMigrate =
      !!address &&
      codeId.length > 0 &&
      jsonValidate(currentInput) === null &&
      status.state === "success";

    const { isFetching: isSimulating } = useSimulateFeeQuery({
      enabled: composedTxMsg.length > 0,
      messages: composedTxMsg,
      onSuccess: (gasRes) => {
        if (gasRes) setEstimatedFee(fabricateFee(gasRes));
        else setEstimatedFee(undefined);
      },
      onError: (e) => {
        setSimulateError(e.message);
        setEstimatedFee(undefined);
      },
    });

    const { refetch } = useLCDCodeInfo(codeId, {
      enabled: !!address && !!codeId.length,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        const permission = data.code_info.instantiate_permission;
        setValue("codeHash", data.code_info.data_hash.toLowerCase());
        if (
          resolvePermission(
            address as HumanAddr,
            permission.permission,
            permission.addresses,
            permission.address
          )
        )
          setStatus({ state: "success" });
        else {
          setStatus({
            state: "error",
            message:
              "This wallet does not have permission to migrate to this code",
          });
          setSimulateError("");
        }
      },
      onError() {
        setStatus({ state: "error", message: "This code ID does not exist" });
        setSimulateError("");
      },
    });

    const proceed = useCallback(async () => {
      AmpTrack(AmpEvent.ACTION_MIGRATE);
      const stream = await migrateTx({
        contractAddress,
        codeId: Number(codeId),
        migrateMsg: JSON.parse(currentInput),
        estimatedFee,
        onTxSucceed: () => setProcessing(false),
        onTxFailed: () => setProcessing(false),
      });

      if (stream) {
        setProcessing(true);
        broadcast(stream);
      }
    }, [
      migrateTx,
      contractAddress,
      codeId,
      currentInput,
      estimatedFee,
      broadcast,
      setProcessing,
    ]);

    useEffect(() => {
      if (codeId.length) {
        setStatus({ state: "loading" });
        const timer = setTimeout(() => {
          refetch();
        }, 500);
        return () => clearTimeout(timer);
      }
      setStatus({ state: "init" });

      return () => {};
    }, [address, codeId, refetch]);

    useEffect(() => {
      if (enableMigrate) {
        setSimulateError("");
        const composedMsg = composeMsg(MsgType.MIGRATE, {
          sender: address as HumanAddr,
          contract: contractAddress as ContractAddr,
          codeId: Long.fromString(codeId),
          msg: Buffer.from(currentInput),
        });
        const timeoutId = setTimeout(() => {
          setComposedTxMsg([composedMsg]);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
      return () => {};
    }, [address, codeId, contractAddress, enableMigrate, currentInput]);

    return (
      <>
        <Heading as="h6" variant="h6" mb={4}>
          To Code ID
        </Heading>
        <CodeSelectSection
          name="codeId"
          control={control}
          status={status}
          error={errors.codeId?.message}
          onCodeSelect={(code: string) => {
            setValue("codeId", code);
          }}
          setCodeHash={(data: CodeIdInfoResponse) => {
            setValue("codeHash", data.code_info.data_hash.toLowerCase());
          }}
          codeId={codeId}
        />
        <Flex align="center" justify="space-between" mt={12} mb={6}>
          <Heading as="h6" variant="h6">
            Migrate Message
          </Heading>
          <Tooltip
            label="Select or fill code id first"
            isDisabled={Boolean(codeHash)}
          >
            <div>
              <MessageInputSwitch
                tabs={Object.values(MessageTabs)}
                currentTab={tab}
                onTabChange={setTab}
                disabled={!codeHash}
              />
            </div>
          </Tooltip>
        </Flex>
        <Box
          sx={{
            "& .json-input": {
              display: resolveTabDisplay(tab, MessageTabs.JSON_INPUT),
            },
            "& .your-schema": {
              display: resolveTabDisplay(tab, MessageTabs.YOUR_SCHEMA),
            },
          }}
        >
          <div className="json-input">
            <JsonInput
              text={msgInput[MessageTabs.JSON_INPUT]}
              setText={(msg: string) =>
                setValue("msgInput", {
                  ...msgInput,
                  [MessageTabs.JSON_INPUT]: msg,
                })
              }
              minLines={10}
            />
          </div>
          <div className="your-schema">
            <SchemaSection
              codeHash={codeHash}
              codeId={codeId}
              setSchemaInput={(msg: string) =>
                setValue("msgInput", {
                  ...msgInput,
                  [MessageTabs.YOUR_SCHEMA]: msg,
                })
              }
            />
          </div>
        </Box>
        {simulateError && (
          <Flex gap={2} mb={4}>
            <CustomIcon
              name="alert-circle-solid"
              boxSize={3}
              color="error.main"
            />
            <Text variant="body3" color="error.main">
              {simulateError}
            </Text>
          </Flex>
        )}
        <Flex
          fontSize="14px"
          color="text.dark"
          alignSelf="flex-start"
          alignItems="center"
          display="flex"
          gap={1}
        >
          <p>Transaction Fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
        <Flex justify="space-between" w="100%" mt={8}>
          <Button
            variant="outline-gray"
            w="128px"
            leftIcon={<CustomIcon name="chevron-left" />}
            onClick={handleBack}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            w="128px"
            disabled={!enableMigrate || !estimatedFee || isSimulating}
            onClick={proceed}
            isLoading={processing}
            sx={{ pointerEvents: processing && "none" }}
          >
            Migrate
          </Button>
        </Flex>
      </>
    );
  }
);
