import { Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";

import { DropZone } from "lib/components/dropzone";
import { ControllerInput } from "lib/components/forms";
import { UploadCard } from "lib/components/upload/components/UploadCard";
import type { UploadSectionState } from "lib/components/upload/types";
import { getMaxCodeNameLengthError, MAX_CODE_NAME_LENGTH } from "lib/data";

export const UploadFile = observer(() => {
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
  const { wasmFile, codeDesc, simulateStatus, simulateError } = watch();
  return (
    <>
      <Heading as="h6" variant="h6" pt={12} pb={6}>
        Upload Wasm File
      </Heading>
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
        mt={8}
      />
    </>
  );
});
