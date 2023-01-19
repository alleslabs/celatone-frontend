import { Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { ButtonCard } from "lib/components/ButtonCard";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useEndpoint } from "lib/hooks";
import { queryInstantiateInfo } from "lib/services/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import type { MigratePageState } from "./types";

const defaultValues: MigratePageState = {
  isValid: false,
  contractAddress: "" as ContractAddr,
  admin: undefined,
  codeId: undefined,
};

const Migrate = () => {
  const router = useRouter();
  const endpoint = useEndpoint();
  const { address } = useWallet();

  const { setValue, watch } = useForm<MigratePageState>({
    mode: "all",
    defaultValues,
  });
  const [isValid, contractAddress, admin] = watch([
    "isValid",
    "contractAddress",
    "admin",
    "codeId",
  ]);

  const onContractSelect = useCallback(
    (contract: ContractAddr) => {
      router.push(
        {
          pathname: "/migrate",
          query: { ...(contract && { contract }) },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  useQuery(
    ["query", "instantiateInfo", contractAddress],
    async () => queryInstantiateInfo(endpoint, contractAddress),
    {
      enabled: !!contractAddress,
      retry: 0,
      onSuccess(data) {
        const codeIdParam = Number(getFirstQueryParam(router.query.codeId));
        setValue("isValid", true);
        setValue("admin", data.admin);
        setValue("codeId", codeIdParam);
      },
      onError() {
        setValue("isValid", false);
        setValue("admin", defaultValues.admin);
        setValue("codeId", defaultValues.codeId);
      },
    }
  );

  useEffect(() => {
    const contractAddressParam = getFirstQueryParam(
      router.query.contract
    ) as ContractAddr;

    setValue("contractAddress", contractAddressParam);
  }, [router, setValue]);

  const disabled = !isValid || admin !== address;

  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        MIGRATE CONTRACT
      </Text>
      <Stepper currentStep={1} />
      <Heading as="h4" variant="h4" my="48px">
        Migrate Contract
      </Heading>
      {/* Select Migrate Contract modal */}
      <ContractSelectSection
        mode="only-admin"
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
      />
      <ButtonCard
        disabled={disabled}
        title="Upload new WASM File"
        description="Deploy contract by upload new Wasm file"
        onClick={() => {}}
        mb="16px"
      />
      <ButtonCard
        disabled={disabled}
        title="Use existing Code IDs"
        description="Input code ID or select from stored codes or your saved codes"
        onClick={() => {}}
      />
    </WasmPageContainer>
  );
};

export default Migrate;
