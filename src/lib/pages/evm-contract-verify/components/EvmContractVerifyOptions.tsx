import type { EvmContractVerifyForm } from "lib/types";
import type { Control } from "react-hook-form";

import { Grid, Heading, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { EvmProgrammingLanguage, EvmVerifyOptions } from "lib/types";
import { useController, useWatch } from "react-hook-form";

interface EvmContractVerifyVyperProps {
  control: Control<EvmContractVerifyForm>;
}

const EvmContractVerifyOptionsVyper = () => (
  <>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.VyperUploadFile}
      variant="gray-card"
      w="full"
      width="fit-content"
    >
      Upload file
    </Radio>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.VyperContractCode}
      variant="gray-card"
      w="full"
      width="fit-content"
    >
      Contract code
    </Radio>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.VyperJsonInput}
      variant="gray-card"
      w="full"
      width="fit-content"
    >
      JSON input
    </Radio>
  </>
);

const EvmContractVerifyOptionsSolidity = () => (
  <>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.SolidityUploadFiles}
      variant="gray-card"
      w="full"
      width="fit-content"
    >
      Upload file(s)
    </Radio>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.SolidityContractCode}
      variant="gray-card"
      w="full"
      width="fit-content"
    >
      Contract code
    </Radio>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.SolidityJsonInput}
      variant="gray-card"
      w="full"
      width="fit-content"
    >
      JSON input
    </Radio>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.SolidityHardhat}
      variant="gray-card"
      w="full"
      width="fit-content"
    >
      Hardhat
    </Radio>
    <Radio
      overflow="hidden"
      value={EvmVerifyOptions.SolidityFoundry}
      variant="gray-card"
      w="full"
      width="fit-content"
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
        Select verification option
      </Heading>
      <RadioGroup value={field.value} onChange={(val) => field.onChange(val)}>
        <Grid gap={4} gridTemplateColumns="repeat(3, 1fr)">
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
