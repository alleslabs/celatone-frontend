import { Grid, Heading, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Control, useController, useWatch } from "react-hook-form";
import {
  EvmContractVerifyForm,
  EvmProgrammingLanguage,
  VerificationOptions,
} from "../types";

interface EvmContractVerifyVyperProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyOptions = ({
  control,
}: EvmContractVerifyVyperProps) => {
  const { field: verifyFormOptinField } = useController({
    control,
    name: "verifyForm.option",
  });

  const [verifyFormOption, language] = useWatch({
    control,
    name: ["verifyForm.option", "language"],
  });

  return (
    <Stack spacing={6}>
      <Heading as="h6" variant="h6">
        Select Verification Option
      </Heading>
      <RadioGroup
        onChange={(nextVal) => verifyFormOptinField.onChange(nextVal)}
        value={verifyFormOption}
      >
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4} maxW={640}>
          {language === EvmProgrammingLanguage.Solidity && (
            <Radio
              variant="gray-card"
              width="fit-content"
              value={VerificationOptions.UploadFiles}
              overflow="hidden"
              w="full"
              size="sm"
            >
              Upload Files
            </Radio>
          )}
          {language === EvmProgrammingLanguage.Vyper && (
            <Radio
              variant="gray-card"
              width="fit-content"
              value={VerificationOptions.UploadFile}
              overflow="hidden"
              w="full"
              size="sm"
            >
              Upload File
            </Radio>
          )}
          <Radio
            variant="gray-card"
            width="fit-content"
            value={VerificationOptions.ContractCode}
            overflow="hidden"
            w="full"
            size="sm"
          >
            Contract Code
          </Radio>
          <Radio
            variant="gray-card"
            width="fit-content"
            value={VerificationOptions.JsonInput}
            overflow="hidden"
            w="full"
            size="sm"
          >
            JSON Input
          </Radio>
          {language === EvmProgrammingLanguage.Solidity && (
            <>
              <Radio
                variant="gray-card"
                width="fit-content"
                value={VerificationOptions.Hardhat}
                overflow="hidden"
                w="full"
                size="sm"
              >
                Hardhat
              </Radio>
              <Radio
                variant="gray-card"
                width="fit-content"
                value={VerificationOptions.Foundry}
                overflow="hidden"
                w="full"
                size="sm"
              >
                Foundry
              </Radio>
            </>
          )}
        </Grid>
      </RadioGroup>
    </Stack>
  );
};
