import { Button, Flex, Grid, GridItem, SkeletonText } from "@chakra-ui/react";
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
        helperText="Input must be the contract that you have admin access"
        label="Contract Address"
        name="contractAddress"
        size="md"
        status={debouncedKeyword ? handleInputStatus : undefined}
        variant="fixed-floating"
        control={control}
        placeholder={`ex. ${truncate(contractExample)}`}
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
      borderWidth="thin"
      width="full"
      align="center"
      gap={4}
      p={4}
      borderColor="gray.800"
      borderRadius="8px"
    >
      <Grid gridTemplateColumns="1fr 1fr" gap={6} flexGrow={1}>
        <GridItem>
          <LabelText label="Contract Address">
            {!isFetching ? (
              <ExplorerLink
                type="contract_address"
                value={debouncedKeyword}
                showCopyOnHover
              />
            ) : (
              <SkeletonText size="sm" noOfLines={1} skeletonHeight={4} />
            )}
          </LabelText>
        </GridItem>
        <GridItem>
          <LabelText label="Contract Name">
            {!isFetching ? (
              data?.contract.label
            ) : (
              <SkeletonText size="sm" noOfLines={1} skeletonHeight={4} />
            )}
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
