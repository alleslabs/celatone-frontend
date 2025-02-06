import { Control, useWatch } from "react-hook-form";
import { EvmContractVerifyForm, EvmVerifyOptions } from "../types";
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
    case EvmVerifyOptions.SolidityUploadFiles:
      return (
        <EvmContractVerifySolidityUploadFiles
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case EvmVerifyOptions.SolidityContractCode:
      return (
        <EvmContractVerifySolidityContractCode
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case EvmVerifyOptions.SolidityJsonInput:
      return <EvmContractVerifySolidityJsonInput control={control} />;
    case EvmVerifyOptions.SolidityHardhat:
      return <EvmContractVerifySolidityHardhat control={control} />;
    case EvmVerifyOptions.SolidityFoundry:
      return <EvmContractVerifySolidityFoundry control={control} />;
    // Vyper
    case EvmVerifyOptions.VyperUploadFile:
      return (
        <EvmContractVerifyVyperUploadFile
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case EvmVerifyOptions.VyperContractCode:
      return (
        <EvmContractVerifyVyperContractCode
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case EvmVerifyOptions.VyperJsonInput:
      return <EvmContractVerifyVyperJsonInput control={control} />;
    default:
      return null;
  }
};
