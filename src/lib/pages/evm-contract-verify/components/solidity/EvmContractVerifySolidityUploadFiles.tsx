import { EvmContractVerifyForm } from "../../types";
import { Control } from "react-hook-form";
import { ConstructorArgs } from "../ConstructorArgs";

interface EvmContractVerifySolidityUploadFilesProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityUploadFiles = ({
  control,
}: EvmContractVerifySolidityUploadFilesProps) => {
  return (
    <div>
      TODO: EvmContractVerifySolidityUploadFiles
      <br />
      <br />
      <ConstructorArgs control={control} />
    </div>
  );
};
