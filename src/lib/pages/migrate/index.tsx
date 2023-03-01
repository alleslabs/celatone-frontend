import { Box, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useCelatoneApp,
  useInternalNavigate,
  useLCDEndpoint,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpTrackToMigrate } from "lib/services/amplitude";
import { queryInstantiateInfo } from "lib/services/contract";
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
  const { indexerGraphClient } = useCelatoneApp();
  const router = useRouter();
  const navigate = useInternalNavigate();
  const endpoint = useLCDEndpoint();
  const { address = "" } = useWallet();

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
    ["query", "instantiate_info", endpoint, contractAddress],
    async () =>
      queryInstantiateInfo(endpoint, indexerGraphClient, contractAddress),
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
        <Box w="full" mb="24px">
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
          <Heading as="h5" variant="h5" textAlign="center" mt="48px">
            Migrate Contract
          </Heading>
        </Box>
      ) : (
        <Box w="full" mb="48px">
          <Heading as="h5" variant="h5" textAlign="center" my="12px">
            Migrate Contract
          </Heading>
          <Stepper mode="migrate" currentStep={2} />
        </Box>
      )}
      <ConnectWalletAlert
        mb="24px"
        subtitle="You need to connect your wallet to perform this action"
      />
      {/* Select Migrate Contract modal */}
      <ContractSelectSection
        mode="only-admin"
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
      />
      <Box mt="48px" w="full">
        {renderBody()}
      </Box>
    </WasmPageContainer>
  );
};

export default Migrate;
