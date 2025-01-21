import { Control, useWatch } from "react-hook-form";
import { EvmContractVerifyForm, VerifyOptions } from "../types";
import {
  EvmContractVerifyVyperContractCode,
  EvmContractVerifyVyperJsonInput,
  EvmContractVerifyVyperUploadFile,
} from "./vyper";
import {
  EvmContractVerifySolidityContractCode,
  EvmContractVerifySolidityFoundry,
  EvmContractVerifySolidityHardhat,
  EvmContractVerifySolidityJsonInput,
  EvmContractVerifySolidityUploadFiles,
} from "./solidity";

interface EvmContractVerifyFormsProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyForms = ({
  control,
}: EvmContractVerifyFormsProps) => {
  const verifyOption = useWatch({
    control,
    name: "option",
  });

  switch (verifyOption) {
    // Vyper
    case VerifyOptions.VyperUploadFile:
      return <EvmContractVerifyVyperUploadFile control={control} />;
    case VerifyOptions.VyperContractCode:
      return <EvmContractVerifyVyperContractCode control={control} />;
    case VerifyOptions.VyperJsonInput:
      return <EvmContractVerifyVyperJsonInput control={control} />;
    // Solidity
    case VerifyOptions.SolidityUploadFiles:
      return <EvmContractVerifySolidityUploadFiles control={control} />;
    case VerifyOptions.SolidityContractCode:
      return <EvmContractVerifySolidityContractCode control={control} />;
    case VerifyOptions.SolidityJsonInput:
      return <EvmContractVerifySolidityJsonInput control={control} />;
    case VerifyOptions.SolidityHardhat:
      return <EvmContractVerifySolidityHardhat control={control} />;
    case VerifyOptions.SolidityFoundry:
      return <EvmContractVerifySolidityFoundry control={control} />;
    default:
      return null;
  }
};
