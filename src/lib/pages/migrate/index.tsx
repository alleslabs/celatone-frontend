import type { BechAddr32, Option } from "lib/types";

import { Box, Heading, Text } from "@chakra-ui/react";
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
import { useUploadAccessParamsRest } from "lib/services/wasm/code";
import { useContractData } from "lib/services/wasm/contract";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import type { MigratePageState } from "./types";

import { MigrateContract } from "./components/MigrateContract";
import { MigrateOptions } from "./components/MigrateOptions";
import { UploadNewCode } from "./components/UploadNewCode";
import { zMigrateQueryParams } from "./types";

const defaultValues: MigratePageState = {
  migrateStep: "migrate_options",
  contractAddress: "" as BechAddr32,
  admin: undefined,
  codeId: undefined,
};

interface MigrateBodyProps {
  contractAddress: BechAddr32;
  codeId: Option<number>;
}

const MigrateBody = ({
  contractAddress: contractAddressParam,
  codeId: codeIdParam,
}: MigrateBodyProps) => {
  useWasmConfig({ shouldRedirect: true });
  const navigate = useInternalNavigate();
  const { data: uploadAccessParams, isFetching } = useUploadAccessParamsRest();
  const {
    proceed,
    formData,
    estimatedFee,
    setEstimatedFee,
    shouldNotSimulate,
    setDefaultBehavior,
    simulateStatus,
    isSimulating,
    isDisabledProcess,
  } = useUploadCode(undefined, true);

  const { address = "" } = useCurrentChain();

  const { setValue, watch } = useForm<MigratePageState>({
    mode: "all",
    defaultValues,
  });

  const { migrateStep, contractAddress, admin, codeId } = watch();

  const firstStep = migrateStep !== "migrate_contract";
  const handleBack = () => setValue("migrateStep", "migrate_options");

  const onContractSelect = useCallback(
    (contract: BechAddr32) => {
      navigate({
        pathname: "/migrate",
        query: {
          contract,
          ...(!firstStep && { codeId }),
        },
        options: { shallow: true },
      });
    },
    [codeId, firstStep, navigate]
  );

  useContractData(contractAddress, {
    onSuccess: (data) => {
      if (data.contract.admin === address) {
        setValue("admin", data.contract.admin);
      } else {
        setValue("admin", defaultValues.admin);
        setValue("contractAddress", defaultValues.contractAddress);
      }
    },
    onError: () => {
      setValue("admin", defaultValues.admin);
      setValue("contractAddress", defaultValues.contractAddress);
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
            codeIdParam={codeId}
            contractAddress={contractAddress}
            handleBack={handleBack}
          />
        );
      case "upload_new_code":
        return (
          <UploadNewCode
            estimatedFee={estimatedFee}
            formData={formData}
            isSimulating={isSimulating}
            setDefaultBehavior={setDefaultBehavior}
            setEstimatedFee={setEstimatedFee}
            shouldNotSimulate={shouldNotSimulate}
            simulateStatus={simulateStatus}
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
      <CelatoneSeo pageName="Migrate contract" />
      <ActionPageContainer>
        {firstStep ? (
          <Box mb={6} w="full">
            <Text
              color="text.dark"
              fontWeight={700}
              mb={3}
              textAlign="center"
              variant="body1"
            >
              MIGRATE CONTRACT
            </Text>
            <Stepper mode="migrate" currentStep={1} />
            <Heading as="h5" variant="h5" textAlign="center" mt={12}>
              Migrate contract
            </Heading>
          </Box>
        ) : (
          <Box w="full" mb={12}>
            <Heading as="h5" variant="h5" textAlign="center" my={3}>
              Migrate contract
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
