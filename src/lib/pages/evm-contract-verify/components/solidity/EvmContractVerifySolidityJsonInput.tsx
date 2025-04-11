import type { EvmContractVerifyForm } from "lib/types";
import type { Control } from "react-hook-form";

import { Heading, Stack } from "@chakra-ui/react";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { useController } from "react-hook-form";

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
    name: "verifyForm.solidityJsonInput.jsonFile",
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
        name="verifyForm.solidityJsonInput.constructorArgs"
      />
    </Stack>
  );
};
