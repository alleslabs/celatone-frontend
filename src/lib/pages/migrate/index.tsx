import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import router from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCelatoneApp, useInternalNavigate } from "lib/app-provider";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useLCDEndpoint } from "lib/hooks";
import { queryInstantiateInfo } from "lib/services/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { MigrateContract } from "./components/MigrateContract";
import { MigrateOptions } from "./components/MigrateOptions";
import { UploadNewCode } from "./components/UploadNewCode";
import type { MigratePageState } from "./types";

const defaultValues: MigratePageState = {
  migrateStep: 1.1,
  contractAddress: "" as ContractAddr,
  admin: undefined,
  codeId: "",
};

const Migrate = () => {
  const { indexerGraphClient } = useCelatoneApp();
  const navigate = useInternalNavigate();
  const endpoint = useLCDEndpoint();
  const { address = "" } = useWallet();

  const { setValue, watch } = useForm<MigratePageState>({
    mode: "all",
    defaultValues,
  });
  const { migrateStep, contractAddress, admin, codeId } = watch();

  const firstStep = migrateStep !== 2;
  const handleBack = () => setValue("migrateStep", 1.1);

  const onContractSelect = useCallback(
    (contract: ContractAddr) => {
      navigate({
        pathname: "/migrate",
        query: {
          ...(!firstStep && { "code-id": router.query["code-id"] }),
          contract,
        },
        options: { shallow: true },
      });
    },
    [firstStep, navigate]
  );

  useQuery(
    ["query", "instantiateInfo", contractAddress],
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
    const contractAddressParam = getFirstQueryParam(
      router.query.contract
    ) as ContractAddr;
    const codeIdParam = getFirstQueryParam(router.query["code-id"]);

    setValue("contractAddress", contractAddressParam);
    setValue("codeId", codeIdParam);
    if (contractAddressParam && codeIdParam) setValue("migrateStep", 2);
  }, [setValue]);

  const renderBody = () => {
    switch (migrateStep) {
      case 2:
        return (
          <MigrateContract
            contractAddress={contractAddress}
            codeIdParam={codeId}
            handleBack={handleBack}
          />
        );
      case 1.2:
        return <UploadNewCode handleBack={handleBack} />;
      case 1.1:
      default:
        return (
          <MigrateOptions
            isAdmin={admin === address}
            uploadHandler={() => {
              setValue("migrateStep", 1.2);
            }}
            existHandler={() => {
              setValue("migrateStep", 2);
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
          <Heading as="h4" variant="h4" textAlign="center" mt="48px">
            Migrate Contract
          </Heading>
        </Box>
      ) : (
        <Box w="full" mb="48px">
          <Button
            alignSelf="start"
            variant="ghost-primary"
            onClick={handleBack}
            leftIcon={<ArrowBackIcon boxSize={4} />}
          >
            BACK
          </Button>
          <Heading as="h4" variant="h4" textAlign="center" my="12px">
            Migrate Contract
          </Heading>
          <Stepper mode="migrate" currentStep={2} />
        </Box>
      )}
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
