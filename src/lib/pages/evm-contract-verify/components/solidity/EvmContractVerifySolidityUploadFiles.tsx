import { Heading, Stack } from "@chakra-ui/react";
import { Control, useFieldArray } from "react-hook-form";
import { EvmContractVerifyForm } from "../../types";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmVersionToTarget } from "../EvmVersionToTarget";
import { OptimizerConfiguration } from "../OptimizerConfiguration";
import { ContractLibraries } from "../ContractLibraries";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";

interface EvmContractVerifySolidityUploadFilesProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityUploadFiles = ({
  control,
}: EvmContractVerifySolidityUploadFilesProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "verifyForm.solidityUploadFiles.files",
  });

  return (
    <Stack spacing={12}>
      <Stack spacing={4}>
        <Heading as="h6" variant="h6">
          Upload File(s)
        </Heading>
        {fields.map((field, index) => (
          <UploadCard file={field.file} deleteFile={() => remove(index)} />
        ))}
        <DropZone
          setFiles={(files) => append(files.map((file) => ({ file })))}
          fileType={["sol"]}
        />
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles"
      />
      <OptimizerConfiguration<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles"
      />
      <ContractLibraries<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityUploadFiles"
      />
    </Stack>
  );
};
