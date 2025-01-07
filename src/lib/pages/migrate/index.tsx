import { Box, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { trackToMigrate } from "lib/amplitude";
import {
  useCurrentChain,
  useInternalNavigate,
  useWasmConfig,
} from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractInputSection } from "lib/components/ContractInputSection";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { Stepper } from "lib/components/stepper";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { useUploadCode } from "lib/hooks";
import { useUploadAccessParamsLcd } from "lib/services/wasm/code";
import { useContractData } from "lib/services/wasm/contract";
import type { BechAddr32, Option } from "lib/types";

import { MigrateContract } from "./components/MigrateContract";
import { MigrateOptions } from "./components/MigrateOptions";
import { UploadNewCode } from "./components/UploadNewCode";
import { zMigrateQueryParams } from "./types";
import type { MigratePageState } from "./types";

const defaultValues: MigratePageState = {
  admin: undefined,
  codeId: undefined,
  contractAddress: "" as BechAddr32,
  migrateStep: "migrate_options",
};

interface MigrateBodyProps {
  codeId: Option<number>;
  contractAddress: BechAddr32;
}

const MigrateBody = ({
  codeId: codeIdParam,
  contractAddress: contractAddressParam,
}: MigrateBodyProps) => {
  useWasmConfig({ shouldRedirect: true });
  const navigate = useInternalNavigate();
  const { data: uploadAccessParams, isFetching } = useUploadAccessParamsLcd();
  const {
    estimatedFee,
    formData,
    isDisabledProcess,
    isSimulating,
    proceed,
    setDefaultBehavior,
    setEstimatedFee,
    shouldNotSimulate,
    simulateStatus,
  } = useUploadCode(undefined, true);

  const { address = "" } = useCurrentChain();

  const { setValue, watch } = useForm<MigratePageState>({
    defaultValues,
    mode: "all",
  });

  const { admin, codeId, contractAddress, migrateStep } = watch();

  const firstStep = migrateStep !== "migrate_contract";
  const handleBack = () => setValue("migrateStep", "migrate_options");

  const onContractSelect = useCallback(
    (contract: BechAddr32) => {
      navigate({
        options: { shallow: true },
        pathname: "/migrate",
        query: {
          contract,
          ...(!firstStep && { codeId }),
        },
      });
    },
    [codeId, firstStep, navigate]
  );

  useContractData(contractAddress, {
    onError: () => {
      setValue("admin", defaultValues.admin);
      setValue("contractAddress", defaultValues.contractAddress);
    },
    onSuccess: (data) => {
      if (data.contract.admin === address) {
        setValue("admin", data.contract.admin);
      } else {
        setValue("admin", defaultValues.admin);
        setValue("contractAddress", defaultValues.contractAddress);
      }
    },
  });

  useEffect(() => {
    setValue("contractAddress", contractAddressParam);
    setValue("codeId", codeIdParam);
    if (contractAddressParam && codeIdParam)
      setValue("migrateStep", "migrate_contract");
  }, [codeIdParam, contractAddressParam, setValue]);

  const renderBody = () => {
    switch (migrateStep) {
      case "migrate_contract":
        return (
          <MigrateContract
            handleBack={handleBack}
            codeIdParam={codeId}
            contractAddress={contractAddress}
          />
        );
      case "upload_new_code":
        return (
          <UploadNewCode
            estimatedFee={estimatedFee}
            isSimulating={isSimulating}
            setEstimatedFee={setEstimatedFee}
            simulateStatus={simulateStatus}
            formData={formData}
            setDefaultBehavior={setDefaultBehavior}
            shouldNotSimulate={shouldNotSimulate}
          />
        );
      case "migrate_options":
      default:
        return (
          <MigrateOptions
            existHandler={() => {
              setValue("migrateStep", "migrate_contract");
            }}
            isAdmin={admin === address}
            uploadAccessParams={uploadAccessParams}
            uploadHandler={() => {
              setValue("migrateStep", "upload_new_code");
            }}
          />
        );
    }
  };

  if (isFetching) return <Loading withBorder={false} />;
  return (
    <>
      <CelatoneSeo pageName="Migrate Contract" />
      <ActionPageContainer>
        {firstStep ? (
          <Box mb={6} w="full">
            <Text
              mb={3}
              textAlign="center"
              variant="body1"
              color="text.dark"
              fontWeight={700}
            >
              MIGRATE CONTRACT
            </Text>
            <Stepper currentStep={1} mode="migrate" />
            <Heading as="h5" mt={12} textAlign="center" variant="h5">
              Migrate Contract
            </Heading>
          </Box>
        ) : (
          <Box mb={12} w="full">
            <Heading as="h5" my={3} textAlign="center" variant="h5">
              Migrate Contract
            </Heading>
            <Stepper currentStep={2} mode="migrate" />
          </Box>
        )}
        <ConnectWalletAlert
          mb={6}
          subtitle="You need to connect your wallet to perform this action"
        />
        {/* Select Migrate Contract modal */}
        <TierSwitcher
          full={
            <ContractSelectSection
              contractAddress={contractAddress}
              mode="only-admin"
              onContractSelect={onContractSelect}
            />
          }
          lite={
            <ContractInputSection
              contract={contractAddress}
              onContractSelect={onContractSelect}
            />
          }
        />
        <Box mt={12} w="full">
          {renderBody()}
        </Box>
      </ActionPageContainer>
      {migrateStep === "upload_new_code" && (
        <FooterCta
          actionButton={{
            isDisabled: isDisabledProcess,
            onClick: proceed,
          }}
          actionLabel="Upload"
          cancelButton={{
            leftIcon: <CustomIcon name="chevron-left" />,
            onClick: handleBack,
          }}
        />
      )}
    </>
  );
};

const Migrate = () => {
  const router = useRouter();
  const validated = zMigrateQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      trackToMigrate(!!validated.data.contract, !!validated.data.codeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      {validated.success && (
        <MigrateBody
          codeId={validated.data.codeId}
          contractAddress={validated.data.contract}
        />
      )}
    </PageContainer>
  );
};

export default Migrate;
