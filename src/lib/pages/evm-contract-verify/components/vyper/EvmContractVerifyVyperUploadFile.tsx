import { Control, useController } from "react-hook-form";
import { EvmContractVerifyForm } from "../../types";
import { Heading, Stack } from "@chakra-ui/react";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmVersionToTarget } from "../EvmVersionToTarget";

interface EvmContractVerifyVyperUploadFileProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyVyperUploadFile = ({
  control,
}: EvmContractVerifyVyperUploadFileProps) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "verifyForm.form.file",
  });

  return (
    <Stack spacing={12}>
      <Stack spacing={4}>
        <Heading as="h6" variant="h6">
          Upload Source Code File
        </Heading>
        {value ? (
          <UploadCard file={value} deleteFile={() => onChange("")} />
        ) : (
          <DropZone
            setFiles={(files) => onChange(files[0])}
            fileType={["vy"]}
          />
        )}
      </Stack>
      <ConstructorArgs control={control} />
      <EvmVersionToTarget control={control} />
    </Stack>
  );
};
