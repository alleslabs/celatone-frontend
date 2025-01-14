import { useEvmConfig, useExampleAddresses, useMobile } from "lib/app-provider";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { track } from "@amplitude/analytics-browser";
import { AmpEvent } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { Grid, GridItem, Heading, Stack, Text } from "@chakra-ui/react";
import { EvmContractVerifyTop } from "./components/EvmContractVerifyTop";
import { ContractLicenseInfoAccordion } from "./components/ContractLicenseInfoAccordion";
import { useStepper } from "lib/hooks";
import { EvmContractFooter } from "./components/EvmContractVerifyFooter";
import { ControllerInput, SelectInput } from "lib/components/forms";
import { useForm } from "react-hook-form";
import {
  EvmContractVerifyForm,
  EvmProgrammingLanguage,
  VerificationOptions,
  zEvmContractVerifyForm,
} from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { isHexModuleAddress, truncate } from "lib/utils";
import { EvmContractVerifySolidity } from "./components/solidity/EvmContractVerifySolidity";
import { EvmContractVerifyVyper } from "./components/vyper/EvmContractVerifyVyper";
import { NoMobile } from "lib/components/modal";

export const EvmContractVerify = () => {
  useEvmConfig({ shouldRedirect: true });
  const isMobile = useMobile();
  const router = useRouter();
  // TODO: add evm contract address
  const { contract: exampleContractAddress } = useExampleAddresses();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_EVM_CONTRACT_VERIFY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const { control, watch, handleSubmit, setValue } =
    useForm<EvmContractVerifyForm>({
      resolver: zodResolver(zEvmContractVerifyForm),
      mode: "all",
      reValidateMode: "onChange",
      defaultValues: {
        contractAddress: router.query.contractAddress ?? "",
        compilerVersion: "",
      },
    });
  const { licenseType, contractAddress, language, compilerVersion } = watch();

  const { handleNext, handlePrevious, hasNext, hasPrevious } = useStepper(
    1,
    () => alert("Submit!")
  );

  const licenseTypeOptions = useMemo(
    () => [
      {
        label: "1. No License (None)",
        value: "no-license",
      },
      {
        label: "2. The Unlicense (Unlicense)",
        value: "the-unlicense",
      },
      {
        label: "3. MIT License (MIT)",
        value: "mit",
      },
    ],
    []
  );

  const programmingLangaugeOptions = useMemo(
    () => [
      {
        label: "Solidity",
        value: EvmProgrammingLanguage.Solidity,
      },
      {
        label: "Vyper",
        value: EvmProgrammingLanguage.Vyper,
      },
    ],
    []
  );

  // TODO: fetch from API
  const compilerVersionOptions = useMemo(
    () => [
      {
        label: "0.8.0",
        value: "0.8.0",
      },
      {
        label: "0.7.0",
        value: "0.7.0",
      },
      {
        label: "0.6.0",
        value: "0.6.0",
      },
    ],
    []
  );

  const isFormDisabled = () => {
    // TODO: Update the validation
    return false;
  };

  return (
    <>
      <CelatoneSeo pageName={`EVM Contract Verify`} />
      {isMobile ? (
        <NoMobile />
      ) : (
        <>
          <PageContainer px={12} py={9} p={0}>
            <Grid
              w="100%"
              templateColumns="6fr 4fr"
              columnGap="32px"
              rowGap="48px"
              maxW="1440px"
              mx="auto"
            >
              <GridItem colSpan={1}>
                <EvmContractVerifyTop />
              </GridItem>
              <GridItem colSpan={2}>
                <Grid templateColumns="6fr 4fr" columnGap="32px" rowGap="24px">
                  <GridItem colSpan={2}>
                    <Heading as="h6" variant="h6">
                      Contract Address & License
                    </Heading>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <ControllerInput
                      label="Contract Address"
                      rules={{
                        required: "",
                      }}
                      placeholder={`ex. ${truncate(exampleContractAddress)}`}
                      name="contractAddress"
                      control={control}
                      variant="fixed-floating"
                      status={{
                        state: isHexModuleAddress(contractAddress)
                          ? "success"
                          : "init",
                      }}
                    />
                  </GridItem>
                  <GridItem colSpan={1} colStart={1}>
                    <SelectInput
                      label="License Type"
                      menuPortalTarget={document.body}
                      isRequired
                      placeholder="Select license type"
                      options={licenseTypeOptions}
                      onChange={(selectedOption) => {
                        if (!selectedOption) return;
                        setValue("licenseType", selectedOption.value);
                      }}
                      value={licenseTypeOptions.find(
                        (option) => option.value === licenseType
                      )}
                    />
                  </GridItem>
                  <GridItem maxHeight={0}>
                    <ContractLicenseInfoAccordion />
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem colSpan={1}>
                <Stack spacing={6}>
                  <Stack spacing={1}>
                    <Heading as="h6" variant="h6">
                      Verification Method
                    </Heading>
                    <Text variant="body2" color="text.dark">
                      Please ensure the setting is the matching with the created
                      contract
                    </Text>
                  </Stack>
                  <Grid templateColumns="repeat(2, 1fr)" columnGap="24px">
                    <SelectInput
                      label="Language"
                      isRequired
                      placeholder="Select language"
                      options={programmingLangaugeOptions}
                      onChange={(selectedOption) => {
                        if (!selectedOption) return;
                        setValue(
                          "verifyForm.option",
                          selectedOption.value ===
                            EvmProgrammingLanguage.Solidity
                            ? VerificationOptions.UploadFiles
                            : VerificationOptions.UploadFile
                        );
                        setValue("language", selectedOption.value);
                        setValue("compilerVersion", "");
                      }}
                      value={programmingLangaugeOptions.find(
                        (option) => option.value === language
                      )}
                      menuPortalTarget={document.body}
                    />
                    <SelectInput
                      label="Compiler Version"
                      isRequired
                      placeholder="Select compiler version"
                      options={compilerVersionOptions}
                      onChange={(selectedOption) => {
                        if (!selectedOption) return;
                        setValue("compilerVersion", selectedOption.value);
                      }}
                      value={compilerVersionOptions.find(
                        (option) => option.value === compilerVersion
                      )}
                      menuPortalTarget={document.body}
                      isDisabled={!language}
                    />
                  </Grid>
                </Stack>
              </GridItem>
              <GridItem colSpan={1} colStart={1}>
                {language === EvmProgrammingLanguage.Solidity && (
                  <EvmContractVerifySolidity control={control} />
                )}
                {language === EvmProgrammingLanguage.Vyper && (
                  <EvmContractVerifyVyper control={control} />
                )}
              </GridItem>
            </Grid>
          </PageContainer>
          <EvmContractFooter
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            isDisabled={isFormDisabled()}
          />
        </>
      )}
    </>
  );
};
