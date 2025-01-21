import { useEvmConfig, useExampleAddresses, useMobile } from "lib/app-provider";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { track } from "@amplitude/analytics-browser";
import { AmpEvent } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import {
  Divider,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { EvmContractVerifyTop } from "./components/EvmContractVerifyTop";
import { ContractLicenseInfoAccordion } from "./components/ContractLicenseInfoAccordion";
import { useStepper } from "lib/hooks";
import { EvmContractFooter } from "./components/EvmContractVerifyFooter";
import { ControllerInput, SelectInput } from "lib/components/forms";
import { useForm } from "react-hook-form";
import {
  EvmContractVerifyForm,
  EvmProgrammingLanguage,
  VerifyOptions,
  zEvmContractVerifyForm,
  zEvmContractVerifyQueryParams,
} from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoMobile } from "lib/components/modal";
import { isHex20Bytes, truncate } from "lib/utils";
import { EvmContractVerifyOptions } from "./components/EvmContractVerifyOptions";
import { EvmContractVerifyForms } from "./components/EvmContractVerifyForms";
import {
  formatEvmOptions,
  getEvmContractVerifyFormDefaultValue,
  getLicenseTypeOptions,
} from "./helper";
import { HarthatInfoAccordion } from "./components/HardhatInfoAccordion";
import { FoundryInfoAccordion } from "./components/FoundryInfoAccordion";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { HexAddr20 } from "lib/types";
import { useEvmVerifyConfig } from "lib/services/verification/evm";
import { Loading } from "lib/components/Loading";
import { EvmVerifyConfig } from "lib/services/types";

interface EvmContractVerifyBodyProps {
  contractAddress: HexAddr20;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmContractVerifyBody = ({
  contractAddress: contractAddressQueryParam,
  evmVerifyConfig,
}: EvmContractVerifyBodyProps) => {
  useEvmConfig({ shouldRedirect: true });
  const isMobile = useMobile();
  const router = useRouter();
  const { evmContract: exampleContractAddress } = useExampleAddresses();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_EVM_CONTRACT_VERIFY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EvmContractVerifyForm>({
    resolver: zodResolver(zEvmContractVerifyForm),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: getEvmContractVerifyFormDefaultValue(
      contractAddressQueryParam
    ),
  });
  const { licenseType, contractAddress, language, compilerVersion, option } =
    watch();

  const { handleNext, handlePrevious, hasNext, hasPrevious } = useStepper(
    1,
    () => alert("Submit!")
  );

  const { licenseTypeOptions, compilerVersionOptions } = useMemo(() => {
    return {
      licenseTypeOptions: getLicenseTypeOptions(evmVerifyConfig),
      compilerVersionOptions:
        language === EvmProgrammingLanguage.Solidity
          ? formatEvmOptions(evmVerifyConfig.solidity_compiler_versions)
          : formatEvmOptions(evmVerifyConfig.vyper_compiler_versions),
    };
  }, [evmVerifyConfig, language]);

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
                      isRequired
                      placeholder={`ex. ${truncate(exampleContractAddress)}`}
                      name="contractAddress"
                      control={control}
                      variant="fixed-floating"
                      status={{
                        state: isHex20Bytes(contractAddress)
                          ? "success"
                          : "init",
                      }}
                      error={errors.contractAddress?.message}
                      rules={{
                        required: "",
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
                        setValue("language", selectedOption.value);
                        setValue("compilerVersion", "");
                        setValue(
                          "option",
                          selectedOption.value ===
                            EvmProgrammingLanguage.Solidity
                            ? VerifyOptions.SolidityUploadFiles
                            : VerifyOptions.VyperUploadFile
                        );
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
              {language && (
                <GridItem colSpan={2} colStart={1}>
                  <Grid
                    templateColumns="6fr 4fr"
                    columnGap="32px"
                    rowGap="24px"
                  >
                    <Stack gap={12}>
                      <EvmContractVerifyOptions control={control} />
                      <Divider />
                      <EvmContractVerifyForms
                        control={control}
                        evmVerifyConfig={evmVerifyConfig}
                      />
                    </Stack>
                    <GridItem maxHeight={0}>
                      {option === VerifyOptions.SolidityHardhat && (
                        <HarthatInfoAccordion />
                      )}
                      {option === VerifyOptions.SolidityFoundry && (
                        <FoundryInfoAccordion />
                      )}
                    </GridItem>
                  </Grid>
                </GridItem>
              )}
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

export const EvmContractVerify = () => {
  useEvmConfig({ shouldRedirect: true });
  const router = useRouter();
  const { data: evmVerifyConfig, isLoading } = useEvmVerifyConfig();

  if (isLoading) return <Loading />;
  if (!evmVerifyConfig) return <ErrorFetching dataName="EVM verify config" />;

  const validated = zEvmContractVerifyQueryParams.safeParse(router.query);

  if (validated.success)
    return (
      <EvmContractVerifyBody
        evmVerifyConfig={evmVerifyConfig}
        {...validated.data}
      />
    );
  return <InvalidState title="Invalid contract address" />;
};
