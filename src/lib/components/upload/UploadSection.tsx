import { Button, Flex, Icon } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";

import {
  useFabricateFee,
  useSimulateFee,
  useUploadContractTx,
} from "lib/app-provider";
import { DropZone } from "lib/components/dropzone";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ControllerInput } from "lib/components/forms";
import { getMaxCodeNameLengthError, MAX_CODE_NAME_LENGTH } from "lib/data";
import { useCodeStore } from "lib/providers/store";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg } from "lib/utils";

import { UploadCard } from "./components/UploadCard";
import type { UploadSectionState } from "./types";

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

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UploadSectionState>({
    defaultValues: {
      wasmFile: undefined,
      codeDesc: "",
      estimatedFee: undefined,
      simulateStatus: "pending",
      simulateError: "",
    },
    mode: "all",
  });
  const { wasmFile, codeDesc, estimatedFee, simulateStatus, simulateError } =
    watch();

  const postUploadTx = useUploadContractTx(isMigrate);

  const proceed = useCallback(async () => {
    if (address) {
      AmpTrack(AmpEvent.ACTION_UPLOAD);
      const stream = await postUploadTx({
        wasmFileName: wasmFile?.name,
        wasmCode: wasmFile?.arrayBuffer(),
        codeDesc,
        estimatedFee,
        onTxSucceed: (codeId: number) => {
          updateCodeInfo(
            codeId,
            address as HumanAddr,
            codeDesc || `${wasmFile?.name}(${codeId})`
          );
        },
      });

      if (stream) broadcast(stream);
    }
  }, [
    postUploadTx,
    wasmFile,
    codeDesc,
    estimatedFee,
    broadcast,
    updateCodeInfo,
    address,
  ]);

  useEffect(() => {
    (async () => {
      if (wasmFile) {
        setValue("simulateStatus", "pending");
        setValue("simulateError", "");
        const msg = composeMsg(MsgType.STORE_CODE, {
          sender: address as HumanAddr,
          wasmByteCode: new Uint8Array(await wasmFile.arrayBuffer()),
        });
        try {
          const estimatedGasUsed = await simulate([msg]);
          if (estimatedGasUsed) {
            setValue("estimatedFee", fabricateFee(estimatedGasUsed));
            setValue("simulateStatus", "completed");
          }
        } catch (err) {
          setValue("simulateStatus", "failed");
          setValue("simulateError", (err as Error).message);
        }
      }
    })();
  }, [wasmFile, address, simulate, fabricateFee, setValue]);

  const isDisabled =
    !estimatedFee || !wasmFile || !!errors.codeDesc || !address;
  return (
    <>
      {wasmFile ? (
        <UploadCard
          file={wasmFile}
          deleteFile={() => {
            setValue("wasmFile", undefined);
            setValue("estimatedFee", undefined);
          }}
          simulateStatus={simulateStatus}
          simulateError={simulateError}
        />
      ) : (
        <DropZone setFile={(file) => setValue("wasmFile", file)} />
      )}
      <ControllerInput
        name="codeDesc"
        control={control}
        label="Code Name (Optional)"
        placeholder="Untitled Name"
        helperText="A short description of what your code does. This is stored locally on your device and can be added or changed later."
        rules={{
          maxLength: MAX_CODE_NAME_LENGTH,
        }}
        error={errors.codeDesc && getMaxCodeNameLengthError(codeDesc.length)}
        variant="floating"
        my="32px"
      />
      <Flex
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
          leftIcon={<Icon as={FiChevronLeft} fontSize="18px" />}
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
