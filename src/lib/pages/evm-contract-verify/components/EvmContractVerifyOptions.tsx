import { Grid, Heading, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Control, useController, useWatch } from "react-hook-form";
import {
  EvmContractVerifyForm,
  EvmProgrammingLanguage,
  EvmVerifyOptions,
} from "lib/services/types";

interface EvmContractVerifyVyperProps {
  control: Control<EvmContractVerifyForm>;
}

const EvmContractVerifyOptionsVyper = () => (
  <>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={EvmVerifyOptions.VyperUploadFile}
      overflow="hidden"
      w="full"
    >
      Upload File
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={EvmVerifyOptions.VyperContractCode}
      overflow="hidden"
      w="full"
    >
      Contract Code
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={EvmVerifyOptions.VyperJsonInput}
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
      value={EvmVerifyOptions.SolidityUploadFiles}
      overflow="hidden"
      w="full"
    >
      Upload File(s)
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={EvmVerifyOptions.SolidityContractCode}
      overflow="hidden"
      w="full"
    >
      Contract Code
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={EvmVerifyOptions.SolidityJsonInput}
      overflow="hidden"
      w="full"
    >
      JSON Input
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={EvmVerifyOptions.SolidityHardhat}
      overflow="hidden"
      w="full"
    >
      Hardhat
    </Radio>
    <Radio
      variant="gray-card"
      width="fit-content"
      value={EvmVerifyOptions.SolidityFoundry}
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
