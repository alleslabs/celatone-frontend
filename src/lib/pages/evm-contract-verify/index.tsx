import { track } from "@amplitude/analytics-browser";
import {
  Divider,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AmpEvent } from "lib/amplitude";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useEvmConfig,
  useExampleAddresses,
  useMobile,
} from "lib/app-provider";
import { ControllerInput, SelectInput } from "lib/components/forms";
import { Loading } from "lib/components/Loading";
import { NoMobile } from "lib/components/modal";
import { EvmVerifyStatusModal } from "lib/components/modal/evm-verify-status";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
import {
  EvmProgrammingLanguage,
  EvmVerifyOptions,
  zEvmContractVerifyBase,
  zEvmContractVerifyForm,
  zEvmContractVerifySolidityOptionContractCodeForm,
  zEvmContractVerifySolidityOptionJsonInputForm,
  zEvmContractVerifySolidityOptionUploadFilesForm,
  zEvmContractVerifyVyperOptionContractCodeForm,
  zEvmContractVerifyVyperOptionJsonInputForm,
  zEvmContractVerifyVyperOptionUploadFileForm,
} from "lib/types";
import {
  useEvmVerifyConfig,
  useEvmVerifyInfo,
  useSubmitEvmVerify,
} from "lib/services/verification/evm";
import type { HexAddr20, Option } from "lib/types";
import { bech32AddressToHex, isHex20Bytes, truncate } from "lib/utils";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ContractLicenseInfoAccordion } from "./components/ContractLicenseInfoAccordion";
import { EvmContractVerifyModal } from "./components/evm-contract-verify-modal";
import { EvmContractFooter } from "./components/EvmContractVerifyFooter";
import { EvmContractVerifyForms } from "./components/EvmContractVerifyForms";
import { EvmContractVerifyOptions } from "./components/EvmContractVerifyOptions";
import { EvmContractVerifyTop } from "./components/EvmContractVerifyTop";
import { FoundryInfoAccordion } from "./components/FoundryInfoAccordion";
import { HarthatInfoAccordion } from "./components/HardhatInfoAccordion";
import {
  formatEvmOptions,
  getEvmContractVerifyFormDefaultValue,
  getLicenseTypeOptions,
  PROGRAMMING_LANGUAGE_OPTIONS,
} from "./helpers";
import { zEvmContractVerifyQueryParams } from "./types";

interface EvmContractVerifyBodyProps {
  contractAddress: Option<HexAddr20>;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmContractVerifyBody = ({
  contractAddress: contractAddressQueryParam,
  evmVerifyConfig,
}: EvmContractVerifyBodyProps) => {
  useEvmConfig({ shouldRedirect: true });
  const isMobile = useMobile();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentChainId } = useCelatoneApp();
  const { user: exampleBechAddress } = useExampleAddresses();
  const { mutate, isLoading, isError } = useSubmitEvmVerify();

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
  const {
    licenseType,
    contractAddress,
    language,
    compilerVersion,
    option,
    verifyForm,
  } = watch();

  const { licenseTypeOptions, compilerVersionOptions } = useMemo(
    () => ({
      licenseTypeOptions: getLicenseTypeOptions(evmVerifyConfig),
      compilerVersionOptions:
        language === EvmProgrammingLanguage.Solidity
          ? formatEvmOptions(evmVerifyConfig.solidityCompilerVersions)
          : formatEvmOptions(evmVerifyConfig.vyperCompilerVersions),
    }),
    [evmVerifyConfig, language]
  );

  const { data: evmVerifyInfo } = useEvmVerifyInfo(contractAddress);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isVerifyByExternals =
    option === EvmVerifyOptions.SolidityFoundry ||
    option === EvmVerifyOptions.SolidityHardhat;

  const isFormDisabled = () => {
    const isEvmContractVerifyBaseSuccess =
      zEvmContractVerifyBase.safeParse({
        contractAddress,
        licenseType,
        language,
        compilerVersion,
        option,
      }).success &&
      language !== undefined &&
      option !== undefined;

    let isEvmOptionSuccess = false;
    if (isVerifyByExternals) isEvmOptionSuccess = true;
    else {
      isEvmOptionSuccess = licenseType !== undefined && compilerVersion !== "";
      if (option === EvmVerifyOptions.SolidityUploadFiles)
        isEvmOptionSuccess =
          isEvmOptionSuccess &&
          zEvmContractVerifySolidityOptionUploadFilesForm.safeParse(
            verifyForm.solidityUploadFiles
          ).success;
      if (option === EvmVerifyOptions.SolidityContractCode)
        isEvmOptionSuccess =
          isEvmOptionSuccess &&
          zEvmContractVerifySolidityOptionContractCodeForm.safeParse(
            verifyForm.solidityContractCode
          ).success;
      if (option === EvmVerifyOptions.SolidityJsonInput)
        isEvmOptionSuccess =
          isEvmOptionSuccess &&
          zEvmContractVerifySolidityOptionJsonInputForm.safeParse(
            verifyForm.solidityJsonInput
          ).success;
      if (option === EvmVerifyOptions.VyperUploadFile)
        isEvmOptionSuccess =
          isEvmOptionSuccess &&
          zEvmContractVerifyVyperOptionUploadFileForm.safeParse(
            verifyForm.vyperUploadFile
          ).success;
      if (option === EvmVerifyOptions.VyperContractCode)
        isEvmOptionSuccess =
          isEvmOptionSuccess &&
          zEvmContractVerifyVyperOptionContractCodeForm.safeParse(
            verifyForm.vyperContractCode
          ).success;
      if (option === EvmVerifyOptions.VyperJsonInput)
        isEvmOptionSuccess =
          isEvmOptionSuccess &&
          zEvmContractVerifyVyperOptionJsonInputForm.safeParse(
            verifyForm.vyperJsonInput
          ).success;
    }

    return (
      !isEvmContractVerifyBaseSuccess ||
      !isEvmOptionSuccess ||
      !!evmVerifyInfo?.isVerified
    );
  };

  const handleSubmit = () => {
    // open modal for either verification status or verification result
    onOpen();

    // if verify by tools, don't need to submit verification
    if (isVerifyByExternals) return;

    if (!option || !language || !licenseType) return;
    mutate(
      {
        option,
        verifyForm,
        contractAddress,
        compilerVersion,
        licenseType,
        chainId: currentChainId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              CELATONE_QUERY_KEYS.EVM_VERIFY_INFO,
              currentChainId,
              contractAddress,
            ],
          });
        },
      }
    );
  };

  return (
    <>
      <CelatoneSeo pageName={`EVM Contract Verify`} />
      {isMobile ? (
        <NoMobile />
      ) : (
        <>
          <PageContainer px={12} pt={9} pb={40} p={0}>
            <Grid
              w="100%"
              templateColumns="6fr 4fr"
              columnGap="32px"
              rowGap="48px"
              maxW="1080px"
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
                      placeholder={`ex. ${truncate(bech32AddressToHex(exampleBechAddress))}`}
                      name="contractAddress"
                      control={control}
                      variant="fixed-floating"
                      status={{
                        state: isHex20Bytes(contractAddress)
                          ? "success"
                          : "init",
                      }}
                      error={
                        evmVerifyInfo?.isVerified
                          ? "Contract is already verified"
                          : errors.contractAddress?.message
                      }
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
                      options={PROGRAMMING_LANGUAGE_OPTIONS}
                      onChange={(selectedOption) => {
                        if (!selectedOption) return;
                        setValue("language", selectedOption.value);
                        setValue("compilerVersion", "");
                        setValue(
                          "option",
                          selectedOption.value ===
                            EvmProgrammingLanguage.Solidity
                            ? EvmVerifyOptions.SolidityUploadFiles
                            : EvmVerifyOptions.VyperUploadFile
                        );
                      }}
                      value={PROGRAMMING_LANGUAGE_OPTIONS.find(
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
                      {option === EvmVerifyOptions.SolidityHardhat && (
                        <HarthatInfoAccordion />
                      )}
                      {option === EvmVerifyOptions.SolidityFoundry && (
                        <FoundryInfoAccordion />
                      )}
                    </GridItem>
                  </Grid>
                </GridItem>
              )}
            </Grid>
          </PageContainer>
          <EvmContractFooter
            actionLabel={
              option === EvmVerifyOptions.SolidityHardhat ||
              option === EvmVerifyOptions.SolidityFoundry
                ? "View Verification Status"
                : "Verify & Publish Contract"
            }
            handleNext={handleSubmit}
            handlePrevious={router.back}
            isDisabled={isFormDisabled()}
          />
          {isVerifyByExternals ? (
            <EvmVerifyStatusModal
              contractAddress={contractAddress}
              evmVerifyInfo={evmVerifyInfo}
              isOpen={isOpen}
              onClose={onClose}
            />
          ) : (
            <EvmContractVerifyModal
              isOpen={isOpen}
              onClose={onClose}
              isError={isError}
              isLoading={isLoading}
              control={control}
            />
          )}
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
        contractAddress={validated.data.contractAddress}
        evmVerifyConfig={evmVerifyConfig}
      />
    );
  return <InvalidState title="Invalid contract address" />;
};
