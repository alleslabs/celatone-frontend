import { Control, useController } from "react-hook-form";
import { Heading, Stack } from "@chakra-ui/react";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmContractVerifyForm } from "lib/services/types";

interface EvmContractVerifySolidityJsonInputProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityJsonInput = ({
  control,
}: EvmContractVerifySolidityJsonInputProps) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "verifyForm.solidityJsonInput.jsonFile",
  });

  return (
    <Stack spacing={12}>
      <Stack spacing={4}>
        <Heading as="h6" variant="h6">
          Provide Standard JSON Input
        </Heading>
        {value ? (
          <UploadCard file={value} deleteFile={() => onChange("")} />
        ) : (
          <DropZone
            setFiles={(files) => onChange(files[0])}
            fileType={["json"]}
          />
        )}
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityJsonInput"
      />
    </Stack>
  );
};
