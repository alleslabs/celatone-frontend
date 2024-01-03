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
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { Loading } from "lib/components/Loading";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useContractDetailByContractAddress } from "lib/services/contractService";
import { useUploadAccessParams } from "lib/services/proposalService";
import type { BechAddr32 } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { MigrateContract } from "./components/MigrateContract";
import { MigrateOptions } from "./components/MigrateOptions";
import { UploadNewCode } from "./components/UploadNewCode";
import type { MigratePageState } from "./types";

const defaultValues: MigratePageState = {
  migrateStep: "migrate_options",
  contractAddress: "" as BechAddr32,
  admin: undefined,
  codeId: "",
};

const Migrate = () => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { data: uploadAccess, isFetching } = useUploadAccessParams();

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
  ) as BechAddr32;
  const codeIdParam = getFirstQueryParam(router.query["code-id"]);

  const onContractSelect = useCallback(
    (contract: BechAddr32) => {
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

  useContractDetailByContractAddress(
    contractAddress,
    (data) => {
      if (data.admin === address) {
        setValue("admin", data.admin);
      } else {
        setValue("admin", defaultValues.admin);
        setValue("contractAddress", defaultValues.contractAddress);
      }
    },
    () => {
      setValue("admin", defaultValues.admin);
      setValue("contractAddress", defaultValues.contractAddress);
    }
  );

  useEffect(() => {
    setValue("contractAddress", contractAddressParam);
    setValue("codeId", codeIdParam);
    if (contractAddressParam && codeIdParam)
      setValue("migrateStep", "migrate_contract");
  }, [codeIdParam, contractAddressParam, setValue]);

  useEffect(() => {
    if (router.isReady) trackToMigrate(!!contractAddressParam, !!codeIdParam);
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

  if (isFetching) return <Loading withBorder={false} />;
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
