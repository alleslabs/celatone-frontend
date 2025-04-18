import {
  Alert,
  AlertDescription,
  Box,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { useCelatoneApp, useCurrentChain, useInitia } from "lib/app-provider";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { useGetMaxLengthError } from "lib/hooks";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useUploadAccessParamsRest } from "lib/services/wasm/code";
import { AccessConfigPermission, WasmVerifyStatus } from "lib/types";
import type {
  BechAddr,
  Option,
  SimulateStatus,
  UploadSectionState,
} from "lib/types";
import { getCodeHash, getWasmVerifyStatus } from "lib/utils";

import { CodeHashBox } from "./CodeHashBox";
import { IndirectlyVerifiedAlert } from "./IndirectlyVerifiedAlert";
import { InstantiatePermissionRadio } from "./InstantiatePermissionRadio";
import { SimulateMessageRender } from "./SimulateMessageRender";
import { UploadCard } from "./UploadCard";
import { DropZone } from "../dropzone";
import { ControllerInput } from "../forms";
import { CustomIcon } from "../icon";
import { PermissionChip } from "../PermissionChip";

interface UploadSectionProps {
  formData: UseFormReturn<UploadSectionState>;
  estimatedFee: Option<StdFee>;
  setEstimatedFee: (fee: StdFee | undefined) => void;
  setDefaultBehavior: () => void;
  shouldNotSimulate: boolean;
  simulateStatus: SimulateStatus;
  isSimulating: boolean;
}

export const UploadSection = ({
  formData,
  estimatedFee,
  setEstimatedFee,
  setDefaultBehavior,
  shouldNotSimulate,
  simulateStatus,
  isSimulating,
}: UploadSectionProps) => {
  const isInitia = useInitia();
  const { data: uploadAccessParams } = useUploadAccessParamsRest();
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();
  const { address } = useCurrentChain();
  const [codeHash, setCodeHash] = useState<string>();
  const { data: derivedWasmVerifyInfo } = useDerivedWasmVerifyInfo(
    undefined,
    codeHash
  );

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = formData;
  const { wasmFile, codeName, permission } = watch();

  // Generate hash value from wasm file
  const setHashValue = useCallback(async () => {
    setCodeHash(await getCodeHash(wasmFile));
  }, [wasmFile]);

  useEffect(() => {
    setHashValue();
  }, [setHashValue]);

  useEffect(() => {
    if (!wasmFile) {
      setDefaultBehavior();
      setValue("addresses", [{ address: "" as BechAddr }]);
    }
  }, [setValue, wasmFile, setDefaultBehavior]);

  useEffect(() => {
    if (wasmFile && address && shouldNotSimulate) setDefaultBehavior();
  }, [
    wasmFile,
    address,
    shouldNotSimulate,
    permission,
    setValue,
    setDefaultBehavior,
  ]);

  const wasmVerifyStatus = getWasmVerifyStatus(derivedWasmVerifyInfo);
  return (
    <Flex direction="column" gap={8} maxW="550px">
      {wasmFile ? (
        <UploadCard
          file={wasmFile}
          deleteFile={() => {
            setValue("wasmFile", undefined);
            setEstimatedFee(undefined);
          }}
        />
      ) : (
        <DropZone
          setFiles={(files) => setValue("wasmFile", files[0])}
          fileType={["wasm"]}
        />
      )}
      <CodeHashBox codeHash={codeHash} />
      <ControllerInput
        name="codeName"
        control={control}
        label="Code name (optional)"
        placeholder="Untitled name"
        helperText="A short description of what your code does. This is stored locally on your device and can be added or changed later."
        rules={{
          maxLength: constants.maxCodeNameLength,
        }}
        error={
          errors.codeName && getMaxLengthError(codeName.length, "code_name")
        }
        variant="fixed-floating"
      />
      {wasmVerifyStatus === WasmVerifyStatus.INDIRECTLY_VERIFIED && (
        <IndirectlyVerifiedAlert
          relatedVerifiedCodes={derivedWasmVerifyInfo?.relatedVerifiedCodes}
        />
      )}
      {isInitia ? (
        <Box>
          <Flex alignItems="center" gap={2}>
            <Heading as="h6" variant="h6" fontWeight={600} my={2}>
              Instantiate permission:
            </Heading>
            <PermissionChip
              instantiatePermission={
                uploadAccessParams?.instantiateDefaultPermission ??
                AccessConfigPermission.EVERYBODY
              }
              permissionAddresses={[]}
            />
          </Flex>
          <Alert variant="primary" mt={3} alignItems="center" gap={3}>
            <CustomIcon name="info-circle" boxSize={4} color="primary.main" />
            <AlertDescription>
              The CosmWasm instantiate permission is set to the default when
              deploying through Initia Scan. To customize permissions, deploy
              via the CLI.
            </AlertDescription>
          </Alert>
        </Box>
      ) : (
        <Flex direction="column">
          <Heading as="h6" variant="h6" fontWeight={600} my={2}>
            Instantiate permission
          </Heading>
          <Text color="text.dark" variant="body2" mb={4}>
            Specify who has the authority to instantiate the contract using this
            code
          </Text>
          <InstantiatePermissionRadio
            control={control}
            setValue={setValue}
            trigger={trigger}
          />
        </Flex>
      )}
      <Box width="full">
        {(simulateStatus.status !== "default" || isSimulating) && (
          <SimulateMessageRender
            value={
              isSimulating
                ? "Checking Wasm and permission validity"
                : simulateStatus.message
            }
            isLoading={isSimulating}
            mb={2}
            isSuccess={simulateStatus.status === "succeeded"}
          />
        )}
        <Flex
          fontSize="14px"
          color="text.dark"
          alignSelf="flex-start"
          alignItems="center"
          display="flex"
          gap={1}
        >
          <p>Transaction fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
