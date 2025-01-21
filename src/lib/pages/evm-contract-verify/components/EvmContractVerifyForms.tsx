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
import { EvmVerifyConfig } from "lib/services/types";

interface EvmContractVerifyFormsProps {
  control: Control<EvmContractVerifyForm>;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmContractVerifyForms = ({
  control,
  evmVerifyConfig,
}: EvmContractVerifyFormsProps) => {
  const verifyOption = useWatch({
    control,
    name: "option",
  });

  switch (verifyOption) {
    // Solidity
    case VerifyOptions.SolidityUploadFiles:
      return (
        <EvmContractVerifySolidityUploadFiles
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case VerifyOptions.SolidityContractCode:
      return (
        <EvmContractVerifySolidityContractCode
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case VerifyOptions.SolidityJsonInput:
      return <EvmContractVerifySolidityJsonInput control={control} />;
    case VerifyOptions.SolidityHardhat:
      return <EvmContractVerifySolidityHardhat control={control} />;
    case VerifyOptions.SolidityFoundry:
      return <EvmContractVerifySolidityFoundry control={control} />;
    // Vyper
    case VerifyOptions.VyperUploadFile:
      return (
        <EvmContractVerifyVyperUploadFile
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case VerifyOptions.VyperContractCode:
      return (
        <EvmContractVerifyVyperContractCode
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case VerifyOptions.VyperJsonInput:
      return <EvmContractVerifyVyperJsonInput control={control} />;
    default:
      return null;
  }
};
