import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { DropZone } from "../dropzone";
import { ControllerInput } from "../forms";
import { FooterCTA } from "../layouts";
import WasmPageContainer from "../WasmPageContainer";
import { AmpEvent, track } from "lib/amplitude";
import type { StoreCodeSucceedCallback } from "lib/app-fns/tx/storeCode";
import {
  useCelatoneApp,
  useCurrentChain,
  useFabricateFee,
  useSimulateFeeForStoreCode,
  useStoreCodeTx,
  useValidateAddress,
} from "lib/app-provider";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import { useGetMaxLengthError } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { BechAddr, SimulateStatus, UploadSectionState } from "lib/types";
import { AccessType } from "lib/types";
import { getCodeHash } from "lib/utils";

import { CodeHashBox } from "./CodeHashBox";
import { InstantiatePermissionRadio } from "./InstantiatePermissionRadio";
import { SimulateMessageRender } from "./SimulateMessageRender";
import { UploadCard } from "./UploadCard";

interface UploadSectionProps {
  handleBack: () => void;
  onComplete?: StoreCodeSucceedCallback;
  isMigrate?: boolean;
}

export const UploadSection = ({
  handleBack,
  onComplete,
  isMigrate = false,
}: UploadSectionProps) => {
  const {
    constants,
    chainConfig: {
      extra: { disableAnyOfAddresses },
    },
  } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();
  const fabricateFee = useFabricateFee();
  const { address } = useCurrentChain();
  const { broadcast } = useTxBroadcast();
  const { updateCodeInfo } = useCodeStore();
  const storeCodeTx = useStoreCodeTx(isMigrate);
  const { validateUserAddress, validateContractAddress } = useValidateAddress();

  const [codeHash, setCodeHash] = useState<string>();
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateStatus, setSimulateStatus] = useState<SimulateStatus>({
    status: "default",
    message: "",
  });

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<UploadSectionState>({
    defaultValues: {
      wasmFile: undefined,
      codeName: "",
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      addresses: [{ address: "" as BechAddr }],
    },
    mode: "all",
  });

  const { wasmFile, codeName, addresses, permission } = watch();

  const setDefaultBehavior = () => {
    setSimulateStatus({ status: "default", message: "" });
    setEstimatedFee(undefined);
  };

  // Should not simulate when permission is any of addresses and address input is not filled, invalid, or empty
  const shouldNotSimulate = useMemo(
    () =>
      permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES &&
      (addresses.some((addr) => addr.address.trim().length === 0) ||
        addresses.some((addr) =>
          Boolean(
            validateUserAddress(addr.address) &&
              validateContractAddress(addr.address)
          )
        )),

    [
      addresses,
      permission,
      validateContractAddress,
      validateUserAddress,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(addresses),
    ]
  );

  const { isFetching: isSimulating } = useSimulateFeeForStoreCode({
    enabled: Boolean(wasmFile && address && !shouldNotSimulate),
    wasmFile,
    permission,
    // Remarks: disableAnyOfAddresses is only used for Cosmos SDK 0.26
    addresses: disableAnyOfAddresses
      ? undefined
      : addresses.map((addr) => addr.address),
    onSuccess: (fee) => {
      if (wasmFile && address) {
        if (shouldNotSimulate) {
          setDefaultBehavior();
        }
        if (fee) {
          setSimulateStatus({
            status: "succeeded",
            message: "Valid Wasm file and instantiate permission",
          });
          setEstimatedFee(fabricateFee(fee));
        }
      }
    },
    onError: (e) => {
      if (shouldNotSimulate) {
        setDefaultBehavior();
      } else {
        setSimulateStatus({ status: "failed", message: e.message });
        setEstimatedFee(undefined);
      }
    },
  });

  const proceed = useCallback(async () => {
    if (address) {
      track(AmpEvent.ACTION_UPLOAD);
      const stream = await storeCodeTx({
        wasmFileName: wasmFile?.name,
        wasmCode: wasmFile?.arrayBuffer(),
        // Remarks: disableAnyOfAddresses is only used for Cosmos SDK 0.26
        addresses: disableAnyOfAddresses
          ? undefined
          : addresses.map((addr) => addr.address),
        permission,
        codeName,
        estimatedFee,
        onTxSucceed: (txResult) => {
          onComplete?.(txResult);
          updateCodeInfo(
            Number(txResult.codeId),
            address,
            codeName || `${wasmFile?.name}(${txResult.codeId})`
          );
        },
      });

      if (stream) broadcast(stream);
    }
  }, [
    address,
    storeCodeTx,
    wasmFile,
    addresses,
    permission,
    codeName,
    estimatedFee,
    broadcast,
    updateCodeInfo,
    onComplete,
    disableAnyOfAddresses,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(addresses),
  ]);

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
  }, [setValue, wasmFile]);

  useEffect(() => {
    if (wasmFile && address && shouldNotSimulate) setDefaultBehavior();
  }, [wasmFile, address, shouldNotSimulate, permission, setValue]);

  return (
    <>
      <WasmPageContainer flexProps={{ py: 0, pb: 12, minH: "auto" }}>
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
              setFile={(file) => setValue("wasmFile", file)}
              fileType="wasm"
            />
          )}
          <CodeHashBox codeHash={codeHash} />
          <ControllerInput
            name="codeName"
            control={control}
            label="Code Name (Optional)"
            placeholder="Untitled Name"
            helperText="A short description of what your code does. This is stored locally on your device and can be added or changed later."
            rules={{
              maxLength: constants.maxCodeNameLength,
            }}
            error={
              errors.codeName && getMaxLengthError(codeName.length, "code_name")
            }
            variant="fixed-floating"
          />
          <Flex direction="column">
            <Heading as="h6" variant="h6" fontWeight={600} my={2}>
              Instantiate Permission
            </Heading>
            <Text color="text.dark" variant="body2" mb={4}>
              Specify who has the authority to instantiate the contract using
              this code
            </Text>
            <InstantiatePermissionRadio
              control={control}
              setValue={setValue}
              trigger={trigger}
            />
          </Flex>
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
              <p>Transaction Fee:</p>
              <EstimatedFeeRender
                estimatedFee={estimatedFee}
                loading={isSimulating}
              />
            </Flex>
          </Box>
        </Flex>
      </WasmPageContainer>
      <FooterCTA
        cancelButton={{
          leftIcon: <CustomIcon name="chevron-left" />,
          onClick: handleBack,
        }}
        actionButton={{
          isDisabled:
            isSimulating ||
            shouldNotSimulate ||
            simulateStatus.status !== "succeeded",
          onClick: proceed,
        }}
        actionLabel="Upload"
      />
    </>
  );
};
