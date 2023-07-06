import { Box, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useInternalNavigate,
  useWasmConfig,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpTrackToMigrate } from "lib/services/amplitude";
import { queryInstantiateInfo } from "lib/services/contract";
import { useUploadAccessParams } from "lib/services/proposalService";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { MigrateContract } from "./components/MigrateContract";
import { MigrateOptions } from "./components/MigrateOptions";
import { UploadNewCode } from "./components/UploadNewCode";
import type { MigratePageState } from "./types";

const defaultValues: MigratePageState = {
  migrateStep: "migrate_options",
  contractAddress: "" as ContractAddr,
  admin: undefined,
  codeId: "",
};

const Migrate = () => {
  useWasmConfig({ shouldRedirect: true });
  const { indexerGraphClient } = useCelatoneApp();
  const router = useRouter();
  const navigate = useInternalNavigate();
  const lcdEndpoint = useBaseApiRoute("rest");
  const { data: uploadAccess } = useUploadAccessParams();

  const { address = "" } = useCurrentChain();

  const { setValue, watch } = useForm<MigratePageState>({
    mode: "all",
    defaultValues,
  });

  const { migrateStep, contractAddress, admin, codeId } = watch();

  const firstStep = migrateStep !== "migrate_contract";
  const handleBack = () => setValue("migrateStep", "migrate_options");

  const contractAddressParam = getFirstQueryParam(
    router.query.contract
  ) as ContractAddr;
  const codeIdParam = getFirstQueryParam(router.query["code-id"]);

  const onContractSelect = useCallback(
    (contract: ContractAddr) => {
      navigate({
        pathname: "/migrate",
        query: {
          ...(!firstStep && { "code-id": codeIdParam }),
          contract,
        },
        options: { shallow: true },
      });
    },
    [codeIdParam, firstStep, navigate]
  );

  useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_INSTANTIATE_INFO,
      lcdEndpoint,
      contractAddress,
    ],
    async () =>
      queryInstantiateInfo(lcdEndpoint, indexerGraphClient, contractAddress),
    {
      enabled: !!contractAddress,
      retry: 0,
      onSuccess(data) {
        if (data.admin === address) {
          setValue("admin", data.admin);
        } else {
          setValue("admin", defaultValues.admin);
          setValue("contractAddress", defaultValues.contractAddress);
        }
      },
      onError() {
        setValue("admin", defaultValues.admin);
        setValue("contractAddress", defaultValues.contractAddress);
      },
    }
  );

  useEffect(() => {
    setValue("contractAddress", contractAddressParam);
    setValue("codeId", codeIdParam);
    if (contractAddressParam && codeIdParam)
      setValue("migrateStep", "migrate_contract");
  }, [codeIdParam, contractAddressParam, setValue]);

  useEffect(() => {
    if (router.isReady)
      AmpTrackToMigrate(!!contractAddressParam, !!codeIdParam);
  }, [router.isReady, codeIdParam, contractAddressParam]);

  const renderBody = () => {
    switch (migrateStep) {
      case "migrate_contract":
        return (
          <MigrateContract
            contractAddress={contractAddress}
            codeIdParam={codeId}
            handleBack={handleBack}
          />
        );
      case "upload_new_code":
        return <UploadNewCode handleBack={handleBack} />;
      case "migrate_options":
      default:
        return (
          <MigrateOptions
            isAdmin={admin === address}
            uploadAccess={uploadAccess}
            uploadHandler={() => {
              setValue("migrateStep", "upload_new_code");
            }}
            existHandler={() => {
              setValue("migrateStep", "migrate_contract");
            }}
          />
        );
    }
  };

  return (
    <WasmPageContainer>
      {firstStep ? (
        <Box w="full" mb={6}>
          <Text
            variant="body1"
            color="text.dark"
            textAlign="center"
            mb={3}
            fontWeight={700}
          >
            MIGRATE CONTRACT
          </Text>
          <Stepper mode="migrate" currentStep={1} />
          <Heading as="h5" variant="h5" textAlign="center" mt={12}>
            Migrate Contract
          </Heading>
        </Box>
      ) : (
        <Box w="full" mb={12}>
          <Heading as="h5" variant="h5" textAlign="center" my={3}>
            Migrate Contract
          </Heading>
          <Stepper mode="migrate" currentStep={2} />
        </Box>
      )}
      <ConnectWalletAlert
        mb={6}
        subtitle="You need to connect your wallet to perform this action"
      />
      {/* Select Migrate Contract modal */}
      <ContractSelectSection
        mode="only-admin"
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
      />
      <Box mt={12} w="full">
        {renderBody()}
      </Box>
    </WasmPageContainer>
  );
};

export default Migrate;
