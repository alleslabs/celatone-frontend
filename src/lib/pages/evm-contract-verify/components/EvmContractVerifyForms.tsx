import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
import type { Control } from "react-hook-form";

import { EvmVerifyOptions } from "lib/types";
import { useWatch } from "react-hook-form";

import {
  EvmContractVerifySolidityContractCode,
  EvmContractVerifySolidityFoundry,
  EvmContractVerifySolidityHardhat,
  EvmContractVerifySolidityJsonInput,
  EvmContractVerifySolidityUploadFiles,
} from "./solidity";
import {
  EvmContractVerifyVyperContractCode,
  EvmContractVerifyVyperJsonInput,
  EvmContractVerifyVyperUploadFile,
} from "./vyper";

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
    case EvmVerifyOptions.SolidityContractCode:
      return (
        <EvmContractVerifySolidityContractCode
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    case EvmVerifyOptions.SolidityFoundry:
      return <EvmContractVerifySolidityFoundry control={control} />;
    case EvmVerifyOptions.SolidityHardhat:
      return <EvmContractVerifySolidityHardhat control={control} />;
    case EvmVerifyOptions.SolidityJsonInput:
      return <EvmContractVerifySolidityJsonInput control={control} />;
    // Solidity
    case EvmVerifyOptions.SolidityUploadFiles:
      return (
        <EvmContractVerifySolidityUploadFiles
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
    // Vyper
    case EvmVerifyOptions.VyperUploadFile:
      return (
        <EvmContractVerifyVyperUploadFile
          control={control}
          evmVerifyConfig={evmVerifyConfig}
        />
      );
    default:
      return null;
  }
};
