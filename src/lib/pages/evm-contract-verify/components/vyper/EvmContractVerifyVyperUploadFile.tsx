import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import { Heading, Stack } from "@chakra-ui/react";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmVersionToTarget } from "../EvmVersionToTarget";
import {
  type EvmContractVerifyForm,
  type EvmVerifyConfig,
  EvmVerifyOptions,
} from "lib/types";
import { EvmContractVerifyAlert } from "../EvmContractVerifyAlert";

interface EvmContractVerifyVyperUploadFileProps {
  control: Control<EvmContractVerifyForm>;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmContractVerifyVyperUploadFile = ({
  control,
  evmVerifyConfig,
}: EvmContractVerifyVyperUploadFileProps) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "verifyForm.vyperUploadFile.file",
  });

  return (
    <Stack spacing={12}>
      <EvmContractVerifyAlert option={EvmVerifyOptions.VyperUploadFile} />
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
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.vyperUploadFile.constructorArgs"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        name="verifyForm.vyperUploadFile.evmVersion"
        evmVerifyConfig={evmVerifyConfig}
      />
    </Stack>
  );
};
