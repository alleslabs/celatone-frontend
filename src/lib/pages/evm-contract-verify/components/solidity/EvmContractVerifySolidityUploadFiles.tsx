import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
import type { Control } from "react-hook-form";

import { Heading, Stack } from "@chakra-ui/react";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { EvmVerifyOptions } from "lib/types";
import { Fragment } from "react";
import { useFieldArray } from "react-hook-form";

import { ConstructorArgs } from "../ConstructorArgs";
import { ContractLibraries } from "../ContractLibraries";
import { EvmContractVerifyAlert } from "../EvmContractVerifyAlert";
import { EvmVersionToTarget } from "../EvmVersionToTarget";
import { OptimizerConfiguration } from "../OptimizerConfiguration";

interface EvmContractVerifySolidityUploadFilesProps {
  control: Control<EvmContractVerifyForm>;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmContractVerifySolidityUploadFiles = ({
  control,
  evmVerifyConfig,
}: EvmContractVerifySolidityUploadFilesProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "verifyForm.solidityUploadFiles.files",
  });

  return (
    <Stack spacing={12}>
      <EvmContractVerifyAlert option={EvmVerifyOptions.SolidityUploadFiles} />
      <Stack spacing={4}>
        <Heading as="h6" variant="h6">
          Upload File(s)
        </Heading>
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <UploadCard deleteFile={() => remove(index)} file={field.file} />
          </Fragment>
        ))}
        <DropZone
          fileType={["sol"]}
          setFiles={(files) => append(files.map((file) => ({ file })))}
        />
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles.constructorArgs"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        evmVerifyConfig={evmVerifyConfig}
        name="verifyForm.solidityUploadFiles.evmVersion"
      />
      <OptimizerConfiguration<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles.optimizerConfig"
      />
      <ContractLibraries<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles.contractLibraries"
      />
    </Stack>
  );
};
