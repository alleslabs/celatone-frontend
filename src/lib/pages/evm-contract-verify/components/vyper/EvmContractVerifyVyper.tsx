import { Divider, Stack } from "@chakra-ui/react";
import { EvmContractVerifyForm, VerificationOptions } from "../../types";
import { Control, useWatch } from "react-hook-form";
import { EvmContractVerifyOptions } from "../EvmContractVerifyOptions";
import { EvmContractVerifyVyperUploadFile } from "./EvmContractVerifyVyperUploadFile";
import { EvmContractVerifyVyperContractCode } from "./EvmContractVerifyVyperContractCode";
import { EvmContractVerifyVyperJsonInput } from "./EvmContractVerifyVyperJsonInput";

interface EvmContractVerifyVyperProps {
  control: Control<EvmContractVerifyForm>;
}

const EvmContractVerifyVyperOptions = ({
  control,
}: EvmContractVerifyVyperProps) => {
  const verifyFormOption = useWatch({
    control,
    name: "verifyForm.form.option",
  });

  switch (verifyFormOption) {
    case VerificationOptions.UploadFile:
      return <EvmContractVerifyVyperUploadFile control={control} />;
    case VerificationOptions.ContractCode:
      return <EvmContractVerifyVyperContractCode control={control} />;
    case VerificationOptions.JsonInput:
      return <EvmContractVerifyVyperJsonInput control={control} />;
    default:
      return null;
  }
};

export const EvmContractVerifyVyper = ({
  control,
}: EvmContractVerifyVyperProps) => (
  <Stack spacing={12}>
    <EvmContractVerifyOptions control={control} />
    <Divider />
    <EvmContractVerifyVyperOptions control={control} />
  </Stack>
);
