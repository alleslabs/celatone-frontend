import { Control, useController } from "react-hook-form";
import { Heading, Stack } from "@chakra-ui/react";
import { UploadCard } from "lib/components/upload";
import { DropZone } from "lib/components/dropzone";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmContractVerifyForm } from "lib/types";

interface EvmContractVerifyVyperJsonInputProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyVyperJsonInput = ({
  control,
}: EvmContractVerifyVyperJsonInputProps) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "verifyForm.vyperJsonInput.jsonFile",
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
        name="verifyForm.vyperJsonInput.constructorArgs"
        control={control}
      />
    </Stack>
  );
};
