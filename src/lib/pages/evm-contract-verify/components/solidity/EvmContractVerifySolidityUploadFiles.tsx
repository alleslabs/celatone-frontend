import { Heading, Stack } from "@chakra-ui/react";
import { Fragment } from "react";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { EvmVerifyOptions } from "lib/types";
import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
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
            <UploadCard file={field.file} deleteFile={() => remove(index)} />
          </Fragment>
        ))}
        <DropZone
          setFiles={(files) => append(files.map((file) => ({ file })))}
          fileType={["sol"]}
        />
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles.constructorArgs"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles.evmVersion"
        evmVerifyConfig={evmVerifyConfig}
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
