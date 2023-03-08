import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import Long from "long";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useFabricateFee,
  useSimulateFeeQuery,
  useLCDEndpoint,
} from "lib/app-provider";
import { useMigrateTx } from "lib/app-provider/tx/migrate";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { FormStatus } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import JsonInput from "lib/components/json/JsonInput";
import { CodeSelectSection } from "lib/components/select-code";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { getCodeIdInfo } from "lib/services/code";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { InstantiatePermission, MsgType } from "lib/types";
import { composeMsg, jsonValidate } from "lib/utils";

interface MigrateContractProps {
  contractAddress: ContractAddr;
  codeIdParam: string;
  handleBack: () => void;
}

export const MigrateContract = ({
  contractAddress,
  codeIdParam,
  handleBack,
}: MigrateContractProps) => {
  const { address } = useWallet();
  const { broadcast } = useTxBroadcast();
  const endpoint = useLCDEndpoint();
  const migrateTx = useMigrateTx();
  const fabricateFee = useFabricateFee();

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { codeId: codeIdParam, migrateMsg: "{}" },
    mode: "all",
  });
  const { codeId, migrateMsg } = watch();
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);

  const enableMigrate = !!(
    address &&
    codeId.length &&
    migrateMsg.trim().length &&
    jsonValidate(migrateMsg) === null &&
    status.state === "success"
  );

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

  const { refetch } = useQuery(
    ["query", endpoint, codeId],
    async () => getCodeIdInfo(endpoint, Number(codeId)),
    {
      enabled: !!address && !!codeId.length,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        const permission = data.code_info.instantiate_permission;
        if (
          address &&
          (permission.permission === InstantiatePermission.EVERYBODY ||
            permission.addresses.includes(address as HumanAddr) ||
            permission.address === address)
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
    }
  );

  const proceed = useCallback(async () => {
    AmpTrack(AmpEvent.ACTION_MIGRATE);
    const stream = await migrateTx({
      contractAddress,
      codeId: Number(codeId),
      migrateMsg: JSON.parse(migrateMsg),
      estimatedFee,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
    });

    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [migrateTx, contractAddress, codeId, migrateMsg, estimatedFee, broadcast]);

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
        msg: Buffer.from(migrateMsg),
      });
      const timeoutId = setTimeout(() => {
        setComposedTxMsg([composedMsg]);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [address, codeId, contractAddress, enableMigrate, migrateMsg]);

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
        onCodeSelect={(code: string) => setValue("codeId", code)}
        codeId={codeId}
      />
      <Heading as="h6" variant="h6" mt={12} mb={6}>
        Migrate Message
      </Heading>
      <JsonInput
        text={migrateMsg}
        setText={(msg: string) => setValue("migrateMsg", msg)}
        height="120px"
      />
      {simulateError && (
        <Flex gap={2} mb={4}>
          <CustomIcon
            name="alert-circle-solid"
            boxSize="3"
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
        gap="4px"
      >
        <p>Transaction Fee:</p>
        <EstimatedFeeRender
          estimatedFee={estimatedFee}
          loading={isSimulating}
        />
      </Flex>
      <Flex justify="space-between" w="100%" mt="32px">
        <Button
          size="md"
          variant="outline-gray"
          w="128px"
          leftIcon={<CustomIcon name="chevron-left" />}
          onClick={handleBack}
        >
          Previous
        </Button>
        <Button
          size="md"
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
};
