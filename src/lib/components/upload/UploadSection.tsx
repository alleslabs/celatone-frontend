import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { DropZone } from "../dropzone";
import { ControllerInput } from "../forms";
import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { useGetMaxLengthError } from "lib/hooks";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { WasmVerifyStatus } from "lib/types";
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

interface UploadSectionProps {
  estimatedFee: Option<StdFee>;
  formData: UseFormReturn<UploadSectionState>;
  isSimulating: boolean;
  setDefaultBehavior: () => void;
  setEstimatedFee: (fee: StdFee | undefined) => void;
  shouldNotSimulate: boolean;
  simulateStatus: SimulateStatus;
}

export const UploadSection = ({
  estimatedFee,
  formData,
  isSimulating,
  setDefaultBehavior,
  setEstimatedFee,
  shouldNotSimulate,
  simulateStatus,
}: UploadSectionProps) => {
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
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = formData;
  const { codeName, permission, wasmFile } = watch();

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
    <Flex gap={8} maxW="550px" direction="column">
      {wasmFile ? (
        <UploadCard
          deleteFile={() => {
            setValue("wasmFile", undefined);
            setEstimatedFee(undefined);
          }}
          file={wasmFile}
        />
      ) : (
        <DropZone
          fileType={["wasm"]}
          setFiles={(files) => setValue("wasmFile", files[0])}
        />
      )}
      <CodeHashBox codeHash={codeHash} />
      <ControllerInput
        helperText="A short description of what your code does. This is stored locally on your device and can be added or changed later."
        label="Code Name (Optional)"
        name="codeName"
        rules={{
          maxLength: constants.maxCodeNameLength,
        }}
        variant="fixed-floating"
        control={control}
        error={
          errors.codeName && getMaxLengthError(codeName.length, "code_name")
        }
        placeholder="Untitled Name"
      />
      {wasmVerifyStatus === WasmVerifyStatus.INDIRECTLY_VERIFIED && (
        <IndirectlyVerifiedAlert
          relatedVerifiedCodes={derivedWasmVerifyInfo?.relatedVerifiedCodes}
        />
      )}
      <Flex direction="column">
        <Heading as="h6" my={2} variant="h6" fontWeight={600}>
          Instantiate Permission
        </Heading>
        <Text mb={4} variant="body2" color="text.dark">
          Specify who has the authority to instantiate the contract using this
          code
        </Text>
        <InstantiatePermissionRadio
          setValue={setValue}
          trigger={trigger}
          control={control}
        />
      </Flex>
      <Box width="full">
        {(simulateStatus.status !== "default" || isSimulating) && (
          <SimulateMessageRender
            isSuccess={simulateStatus.status === "succeeded"}
            mb={2}
            value={
              isSimulating
                ? "Checking Wasm and permission validity"
                : simulateStatus.message
            }
            isLoading={isSimulating}
          />
        )}
        <Flex
          alignItems="center"
          alignSelf="flex-start"
          display="flex"
          gap={1}
          color="text.dark"
          fontSize="14px"
        >
          <p>Transaction Fee:</p>
          <EstimatedFeeRender
            estimatedFee={estimatedFee}
            loading={isSimulating}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
