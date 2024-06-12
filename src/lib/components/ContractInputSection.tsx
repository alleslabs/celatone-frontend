import { Button, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useCurrentChain, useExampleAddresses } from "lib/app-provider";
import { useDebounce } from "lib/hooks";
import { useContractData } from "lib/services/wasm/contract";
import type { BechAddr32 } from "lib/types";
import { truncate } from "lib/utils";

import { ExplorerLink } from "./ExplorerLink";
import type { FormStatus } from "./forms";
import { ControllerInput } from "./forms";
import { CustomIcon } from "./icon";
import { LabelText } from "./LabelText";

interface ContractInputSectionProps {
  contract: BechAddr32;
  onContractSelect: (contract: BechAddr32) => void;
}

export const ContractInputSection = ({
  contract,
  onContractSelect,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: ContractInputSectionProps) => {
  const [isChangeContract, setIsChangeContract] = useState(false);
  const { address } = useCurrentChain();
  const { contract: contractExample } = useExampleAddresses();
  const { control, setValue, watch } = useForm({
    defaultValues: {
      contractAddress: "",
    },
  });
  const { contractAddress } = watch();
  const debouncedKeyword = useDebounce(contractAddress);

  const { data, isFetching } = useContractData(debouncedKeyword as BechAddr32, {
    enabled: !!debouncedKeyword,
  });
  const isPermissionAllowed =
    contractAddress && data?.contract.admin === address;

  const handleInputStatus = useMemo((): FormStatus | undefined => {
    if (isFetching) return { state: "loading" };
    if (!contractAddress) return undefined;

    if (!data)
      return {
        state: "error",
        message: "Invalid contract address",
      };
    if (isPermissionAllowed)
      return {
        state: "success",
        message: "You have admin access to this contract",
      };
    if (!isPermissionAllowed)
      return {
        state: "error",
        message: "Your wallet does not have admin access to this contract",
      };

    return undefined;
  }, [isFetching, data, isPermissionAllowed, contractAddress]);

  useEffect(() => {
    if (!contract) return;

    setValue("contractAddress", contract.toString());
  }, [contract, setValue]);

  return isChangeContract || !contract ? (
    <Flex w="full" gap={2}>
      <ControllerInput
        name="contractAddress"
        control={control}
        label="Contract Address"
        placeholder={`ex. ${truncate(contractExample)}`}
        helperText="Input must be the contract that you have admin access"
        variant="fixed-floating"
        size="md"
        status={debouncedKeyword ? handleInputStatus : undefined}
      />
      <Button
        onClick={() => {
          onContractSelect(debouncedKeyword as BechAddr32);
          setIsChangeContract(false);
        }}
        isDisabled={!isPermissionAllowed}
      >
        Submit
      </Button>
      {isChangeContract && (
        <Button
          variant="outline-primary"
          onClick={() => {
            if (contract) setValue("contractAddress", contract.toString());
            setIsChangeContract(false);
          }}
        >
          Cancel
        </Button>
      )}
    </Flex>
  ) : (
    <Flex
      borderWidth="thin"
      borderColor="gray.800"
      p={4}
      borderRadius="8px"
      width="full"
      align="center"
      gap={4}
    >
      <Grid gridTemplateColumns="1fr 1fr" gap={6} flexGrow={1}>
        <GridItem>
          <LabelText label="Contract Address">
            {!isFetching ? (
              <ExplorerLink
                value={debouncedKeyword}
                type="contract_address"
                showCopyOnHover
              />
            ) : (
              <Spinner size="sm" />
            )}
          </LabelText>
        </GridItem>
        <GridItem>
          <LabelText label="Contract Name">
            {!isFetching ? data?.contract.label : <Spinner size="sm" />}
          </LabelText>
        </GridItem>
      </Grid>
      <Button
        variant="outline-primary"
        leftIcon={<CustomIcon name="swap" boxSize="12px" />}
        onClick={() => {
          setValue("contractAddress", "");
          setIsChangeContract(true);
        }}
      >
        Change Contract
      </Button>
    </Flex>
  );
};
