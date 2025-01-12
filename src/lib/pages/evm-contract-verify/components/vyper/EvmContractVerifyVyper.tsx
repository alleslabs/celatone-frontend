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
  const verifyFormOption = useWatch({ control, name: "verifyForm.option" });

  switch (verifyFormOption) {
    case VerificationOptions.UploadFile:
      return <EvmContractVerifyVyperUploadFile />;
    case VerificationOptions.ContractCode:
      return <EvmContractVerifyVyperContractCode />;
    case VerificationOptions.JsonInput:
      return <EvmContractVerifyVyperJsonInput />;
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
