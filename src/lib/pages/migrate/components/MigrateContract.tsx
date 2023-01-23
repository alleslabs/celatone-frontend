import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import Long from "long";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";

import { useFabricateFee, useSimulateFeeQuery } from "lib/app-provider";
import { useMigrateTx } from "lib/app-provider/tx/migrate";
import { CodeSelectSection } from "lib/components/CodeSelectSection";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import JsonInput from "lib/components/json/JsonInput";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
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
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);

  const enableMigrate = !!(
    codeId.length &&
    migrateMsg.trim().length &&
    jsonValidate(migrateMsg) === null &&
    address
  );

  const { isFetching } = useSimulateFeeQuery({
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

  const proceed = useCallback(async () => {
    const stream = await migrateTx({
      contractAddress,
      codeId: Number(codeId),
      migrateMsg: JSON.parse(migrateMsg),
      estimatedFee,
    });

    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [migrateTx, contractAddress, codeId, migrateMsg, estimatedFee, broadcast]);

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
        error={errors.codeId?.message}
        onCodeSelect={(code: string) => setValue("codeId", code)}
        codeId={codeId}
      />
      <JsonInput
        text={migrateMsg}
        setText={(msg: string) => setValue("migrateMsg", msg)}
        height="120px"
      />
      {simulateError && (
        <Flex gap={2} mb={4}>
          <Icon as={IoIosWarning} boxSize={4} color="error.main" />
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
        Transaction Fee:{" "}
        <EstimatedFeeRender estimatedFee={estimatedFee} loading={isFetching} />
      </Flex>
      <Flex justify="space-between" w="100%" mt="32px">
        <Button
          size="md"
          variant="outline-gray"
          w="128px"
          leftIcon={
            <Icon as={FiChevronLeft} color="text.dark" fontSize="18px" />
          }
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          size="md"
          variant="primary"
          w="128px"
          disabled={!enableMigrate || !estimatedFee || isFetching}
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
