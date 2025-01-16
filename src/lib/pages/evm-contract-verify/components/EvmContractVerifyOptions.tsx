import { Grid, Heading, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Control, useController, useWatch } from "react-hook-form";
import {
  EvmContractVerifyForm,
  EvmProgrammingLanguage,
  VerificationOptions,
} from "../types";
import { getVerifyFormInitialValue } from "../helper";

interface EvmContractVerifyVyperProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyOptions = ({
  control,
}: EvmContractVerifyVyperProps) => {
  const { field } = useController({
    control,
    name: "verifyForm.form",
  });

  const [language, verifyFormOption] = useWatch({
    control,
    name: ["verifyForm.language", "verifyForm.form.option"],
  });

  const handleOptionChange = (nextVal: VerificationOptions) => {
    field.onChange(getVerifyFormInitialValue(language, nextVal));
  };

  return (
    <Stack spacing={6}>
      <Heading as="h6" variant="h6">
        Select Verification Option
      </Heading>
      <RadioGroup onChange={handleOptionChange} value={verifyFormOption}>
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {language === EvmProgrammingLanguage.Solidity && (
            <Radio
              variant="gray-card"
              width="fit-content"
              value={VerificationOptions.UploadFiles}
              overflow="hidden"
              w="full"
            >
              Upload File(s)
            </Radio>
          )}
          {language === EvmProgrammingLanguage.Vyper && (
            <Radio
              variant="gray-card"
              width="fit-content"
              value={VerificationOptions.UploadFile}
              overflow="hidden"
              w="full"
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
          >
            Contract Code
          </Radio>
          <Radio
            variant="gray-card"
            width="fit-content"
            value={VerificationOptions.JsonInput}
            overflow="hidden"
            w="full"
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
              >
                Hardhat
              </Radio>
              <Radio
                variant="gray-card"
                width="fit-content"
                value={VerificationOptions.Foundry}
                overflow="hidden"
                w="full"
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
