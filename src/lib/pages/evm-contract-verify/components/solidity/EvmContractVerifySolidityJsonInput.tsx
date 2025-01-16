import { Control, useController } from "react-hook-form";
import { EvmContractVerifyForm } from "../../types";
import { Heading, Stack } from "@chakra-ui/react";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { ConstructorArgs } from "../ConstructorArgs";

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
    name: "verifyForm.form.jsonFile",
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
            fileType={["standard-json"]}
          />
        )}
      </Stack>
      <ConstructorArgs control={control} />
    </Stack>
  );
};
