import { Divider, Stack } from "@chakra-ui/react";
import { EvmContractVerifyOptions } from "../EvmContractVerifyOptions";
import { Control, useWatch } from "react-hook-form";
import { EvmContractVerifyForm, VerificationOptions } from "../../types";
import { EvmContractVerifySolidityUploadFiles } from "./EvmContractVerifySolidityUploadFiles";
import { EvmContractVerifySolidityContractCode } from "./EvmContractVerifySolidityContractCode";
import { EvmContractVerifySolidityJsonInput } from "./EvmContractVerifySolidityJsonInput";
import { EvmContractVerifySolidityHardhat } from "./EvmContractVerifySolidityHardhat";
import { EvmContractVerifySolidityFoundry } from "./EvmContractVerifySolidityFoundry";

interface EvmContractVerifySolidityProps {
  control: Control<EvmContractVerifyForm>;
}

const EvmContractVerifySolidityOptions = ({
  control,
}: EvmContractVerifySolidityProps) => {
  const verifyFormOption = useWatch({ control, name: "verifyForm.option" });

  switch (verifyFormOption) {
    case VerificationOptions.UploadFiles:
      return <EvmContractVerifySolidityUploadFiles control={control} />;
    case VerificationOptions.ContractCode:
      return <EvmContractVerifySolidityContractCode />;
    case VerificationOptions.JsonInput:
      return <EvmContractVerifySolidityJsonInput />;
    case VerificationOptions.Hardhat:
      return <EvmContractVerifySolidityHardhat />;
    case VerificationOptions.Foundry:
      return <EvmContractVerifySolidityFoundry />;
    default:
      return null;
  }
};

export const EvmContractVerifySolidity = ({
  control,
}: EvmContractVerifySolidityProps) => (
  <Stack spacing={12}>
    <EvmContractVerifyOptions control={control} />
    <Divider />
    <EvmContractVerifySolidityOptions control={control} />
  </Stack>
);
