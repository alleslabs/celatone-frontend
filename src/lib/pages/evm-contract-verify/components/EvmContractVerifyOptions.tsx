import { Grid, Heading, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Control, useController, useWatch } from "react-hook-form";
import { EvmContractVerifyForm, VerifyOptions } from "../types";
import { EvmProgrammingLanguage } from "lib/services/types";

interface EvmContractVerifyVyperProps {
  control: Control<EvmContractVerifyForm>;
}

const EvmContractVerifyOptionsVyper = () => (
  <>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.VyperUploadFile}
      overflow="hidden"
      w="full"
    >
      Upload File
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.VyperContractCode}
      overflow="hidden"
      w="full"
    >
      Contract Code
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.VyperJsonInput}
      overflow="hidden"
      w="full"
    >
      JSON Input
    </Radio>
  </>
);

const EvmContractVerifyOptionsSolidity = () => (
  <>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.SolidityUploadFiles}
      overflow="hidden"
      w="full"
    >
      Upload File(s)
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.SolidityContractCode}
      overflow="hidden"
      w="full"
    >
      Contract Code
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.SolidityJsonInput}
      overflow="hidden"
      w="full"
    >
      JSON Input
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.SolidityHardhat}
      overflow="hidden"
      w="full"
    >
      Hardhat
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={VerifyOptions.SolidityFoundry}
      overflow="hidden"
      w="full"
    >
      Foundry
    </Radio>
  </>
);

export const EvmContractVerifyOptions = ({
  control,
}: EvmContractVerifyVyperProps) => {
  const { field } = useController({
    control,
    name: "option",
  });

  const language = useWatch({
    control,
    name: "language",
  });

  return (
    <Stack spacing={6}>
      <Heading as="h6" variant="h6">
        Select Verification Option
      </Heading>
      <RadioGroup onChange={(val) => field.onChange(val)} value={field.value}>
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {language === EvmProgrammingLanguage.Vyper && (
            <EvmContractVerifyOptionsVyper />
          )}
          {language === EvmProgrammingLanguage.Solidity && (
            <EvmContractVerifyOptionsSolidity />
          )}
        </Grid>
      </RadioGroup>
    </Stack>
  );
};
