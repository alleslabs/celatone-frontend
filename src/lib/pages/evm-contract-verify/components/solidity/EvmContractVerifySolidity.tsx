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
  const verifyFormOption = useWatch({
    control,
    name: "verifyForm.form.option",
  });

  switch (verifyFormOption) {
    case VerificationOptions.UploadFiles:
      return <EvmContractVerifySolidityUploadFiles />;
    case VerificationOptions.ContractCode:
      return <EvmContractVerifySolidityContractCode />;
    case VerificationOptions.JsonInput:
      return <EvmContractVerifySolidityJsonInput control={control} />;
    case VerificationOptions.Hardhat:
      return <EvmContractVerifySolidityHardhat control={control} />;
    case VerificationOptions.Foundry:
      return <EvmContractVerifySolidityFoundry control={control} />;
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
