import type { BechAddr32 } from "lib/types";

import { Button, Flex, Grid, GridItem, SkeletonText } from "@chakra-ui/react";
import { useCurrentChain, useExampleAddresses } from "lib/app-provider";
import { useDebounce } from "lib/hooks";
import { useContractData } from "lib/services/wasm/contract";
import { truncate } from "lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { FormStatus } from "./forms";

import { ExplorerLink } from "./ExplorerLink";
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
        message: "Invalid contract address",
        state: "error",
      };
    if (isPermissionAllowed)
      return {
        message: "You have admin access to this contract",
        state: "success",
      };
    if (!isPermissionAllowed)
      return {
        message: "Your wallet does not have admin access to this contract",
        state: "error",
      };

    return undefined;
  }, [isFetching, data, isPermissionAllowed, contractAddress]);

  useEffect(() => {
    if (!contract) return;

    setValue("contractAddress", contract.toString());
  }, [contract, setValue]);

  return isChangeContract || !contract ? (
    <Flex gap={2} w="full">
      <ControllerInput
        control={control}
        helperText="Input must be the contract that you have admin access"
        label="Contract address"
        name="contractAddress"
        placeholder={`ex. ${truncate(contractExample)}`}
        size="md"
        status={debouncedKeyword ? handleInputStatus : undefined}
        variant="fixed-floating"
      />
      <Button
        isDisabled={!isPermissionAllowed}
        onClick={() => {
          onContractSelect(debouncedKeyword as BechAddr32);
          setIsChangeContract(false);
        }}
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
      align="center"
      borderColor="gray.800"
      borderRadius="8px"
      borderWidth="thin"
      gap={4}
      p={4}
      width="full"
    >
      <Grid flexGrow={1} gap={6} gridTemplateColumns="1fr 1fr">
        <GridItem>
          <LabelText label="Contract address">
            {!isFetching ? (
              <ExplorerLink
                showCopyOnHover
                type="contract_address"
                value={debouncedKeyword}
              />
            ) : (
              <SkeletonText noOfLines={1} size="sm" skeletonHeight={4} />
            )}
          </LabelText>
        </GridItem>
        <GridItem>
          <LabelText label="Contract name">
            {!isFetching ? (
              data?.contract.label
            ) : (
              <SkeletonText noOfLines={1} size="sm" skeletonHeight={4} />
            )}
          </LabelText>
        </GridItem>
      </Grid>
      <Button
        leftIcon={<CustomIcon boxSize="12px" name="swap" />}
        variant="outline-primary"
        onClick={() => {
          setValue("contractAddress", "");
          setIsChangeContract(true);
        }}
      >
        Change contract
      </Button>
    </Flex>
  );
};
