import { Button, Flex } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { DropZone } from "../dropzone";
import { ControllerInput } from "../forms";
import {
  useFabricateFee,
  useSimulateFee,
  useUploadContractTx,
} from "lib/app-provider";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import { getMaxCodeNameLengthError, MAX_CODE_NAME_LENGTH } from "lib/data";
import { useCodeStore } from "lib/providers/store";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type {
  Addr,
  HumanAddr,
  SimulateStatus,
  UploadSectionState,
} from "lib/types";
import { AccessType } from "lib/types";
import { composeStoreCodeMsg } from "lib/utils";

import { InstantiatePermissionRadio } from "./components/InstantiatePermissionRadio";
import { UploadCard } from "./components/UploadCard";

interface UploadSectionProps {
  handleBack: () => void;
  isMigrate?: boolean;
}

export const UploadSection = ({
  handleBack,
  isMigrate = false,
}: UploadSectionProps) => {
  const { simulate, loading } = useSimulateFee();
  const fabricateFee = useFabricateFee();
  const { address } = useWallet();
  const { broadcast } = useTxBroadcast();
  const { updateCodeInfo } = useCodeStore();
  const postUploadTx = useUploadContractTx(isMigrate);

  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateStatus, setSimulateStatus] =
    useState<SimulateStatus>("pending");
  const [simulateError, setSimulateError] = useState("");

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadSectionState>({
    defaultValues: {
      wasmFile: undefined,
      codeName: "",
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      addresses: [{ address: "" as Addr }],
    },
    mode: "all",
  });

  const { wasmFile, codeName, addresses, permission } = watch();

  const addressesString = JSON.stringify(addresses);

  const proceed = useCallback(async () => {
    if (address) {
      AmpTrack(AmpEvent.ACTION_UPLOAD);
      const stream = await postUploadTx({
        wasmFileName: wasmFile?.name,
        wasmCode: wasmFile?.arrayBuffer(),
        addresses: addresses.map((addr) => addr.address),
        permission,
        codeName,
        estimatedFee,
        onTxSucceed: (codeId: number) => {
          updateCodeInfo(
            codeId,
            address as HumanAddr,
            codeName || `${wasmFile?.name}(${codeId})`
          );
        },
      });

      if (stream) broadcast(stream);
    }
  }, [
    address,
    postUploadTx,
    wasmFile,
    addresses,
    permission,
    codeName,
    estimatedFee,
    broadcast,
    updateCodeInfo,
  ]);

  useEffect(() => {
    (async () => {
      if (wasmFile) {
        setSimulateStatus("pending");
        setSimulateError("");
        const msg = composeStoreCodeMsg({
          sender: address as HumanAddr,
          wasmByteCode: new Uint8Array(await wasmFile.arrayBuffer()),
          permission,
          addresses: addresses.map((addr) => addr.address),
        });
        try {
          const estimatedGasUsed = await simulate([msg]);
          if (estimatedGasUsed) {
            setEstimatedFee(fabricateFee(estimatedGasUsed));
            setSimulateStatus("completed");
          }
        } catch (err) {
          setSimulateStatus("failed");
          setSimulateError((err as Error).message);
        }
      }
    })();
  }, [
    wasmFile,
    address,
    simulate,
    fabricateFee,
    setValue,
    permission,
    addressesString,
    addresses,
  ]);

  const isDisabled =
    !estimatedFee ||
    !wasmFile ||
    !address ||
    !!errors.codeName ||
    !!errors.addresses;
  return (
    <>
      {wasmFile ? (
        <UploadCard
          file={wasmFile}
          deleteFile={() => {
            setValue("wasmFile", undefined);
            setEstimatedFee(undefined);
          }}
          simulateStatus={simulateStatus}
          simulateError={simulateError}
        />
      ) : (
        <DropZone setFile={(file) => setValue("wasmFile", file)} />
      )}
      <ControllerInput
        name="codeName"
        control={control}
        label="Code Name (Optional)"
        placeholder="Untitled Name"
        helperText="A short description of what your code does. This is stored locally on your device and can be added or changed later."
        rules={{
          maxLength: MAX_CODE_NAME_LENGTH,
        }}
        error={errors.codeName && getMaxCodeNameLengthError(codeName.length)}
        variant="floating"
        my="32px"
      />
      <InstantiatePermissionRadio control={control} setValue={setValue} />
      <Flex
        mt={10}
        fontSize="14px"
        color="text.dark"
        alignSelf="flex-start"
        alignItems="center"
        display="flex"
        gap="4px"
      >
        <p>Transaction Fee:</p>
        <EstimatedFeeRender estimatedFee={estimatedFee} loading={loading} />
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
          disabled={isDisabled}
          onClick={proceed}
        >
          Upload
        </Button>
      </Flex>
    </>
  );
};
