import type { EvmContractVerifyForm } from "lib/types";
import type { Control } from "react-hook-form";

import { Heading, Stack } from "@chakra-ui/react";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { useController } from "react-hook-form";

import { ConstructorArgs } from "../ConstructorArgs";

interface EvmContractVerifyVyperJsonInputProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyVyperJsonInput = ({
  control,
}: EvmContractVerifyVyperJsonInputProps) => {
  const {
    field: { onChange, value },
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
          <UploadCard deleteFile={() => onChange("")} file={value} />
        ) : (
          <DropZone
            fileType={["json"]}
            setFiles={(files) => onChange(files[0])}
          />
        )}
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.vyperJsonInput.constructorArgs"
      />
    </Stack>
  );
};
