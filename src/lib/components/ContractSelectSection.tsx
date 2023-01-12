import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { MdMode, MdOutlineBookmarkBorder } from "react-icons/md";

import { useContractStore, useEndpoint, useMobile } from "lib/hooks";
import { queryInstantiateInfo } from "lib/services/contract";
import type { ContractInfo } from "lib/stores/contract";
import type { ContractAddr, Option } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { EditContractDetails, SaveContractDetails } from "./modal";
import { SelectContract } from "./modal/select-contract";

interface DisplayNameProps {
  notSelected: boolean;
  isValid: boolean;
  name?: string;
  label: string;
}

interface ContractDetailsButtonProps {
  contractAddress: ContractAddr;
  contractInfo: Option<ContractInfo>;
  instantiator: string;
  label: string;
  created: Date;
}

interface ContractSelectSectionProps {
  contractAddress: ContractAddr;
  onContractSelect: (contract: ContractAddr) => void;
}

const DisplayName = ({
  notSelected,
  isValid,
  name,
  label,
}: DisplayNameProps) => {
  const displayName = useMemo(() => {
    if (notSelected) return "Not Selected";
    if (!isValid) return "Invalid Contract";
    return name ?? label;
  }, [isValid, label, name, notSelected]);

  return (
    <Text
      textColor={notSelected ? "text.disabled" : "text.dark"}
      variant="body2"
    >
      {displayName}
    </Text>
  );
};

const ContractDetailsButton = ({
  contractAddress,
  contractInfo,
  instantiator,
  label,
  created,
}: ContractDetailsButtonProps) => {
  const isExist = !!contractInfo?.lists;
  return isExist ? (
    <EditContractDetails
      contractInfo={contractInfo}
      triggerElement={
        <Button
          variant="ghost-gray"
          float="right"
          leftIcon={<Icon as={MdMode} boxSize="5" />}
        >
          Edit
        </Button>
      }
    />
  ) : (
    <SaveContractDetails
      contractInfo={{
        contractAddress,
        instantiator,
        label,
        created,
        ...contractInfo,
      }}
      triggerElement={
        <Button
          variant="outline-gray"
          float="right"
          leftIcon={<Icon as={MdOutlineBookmarkBorder} boxSize="5" />}
        >
          Add To List
        </Button>
      }
    />
  );
};

export const ContractSelectSection = observer(
  ({ contractAddress, onContractSelect }: ContractSelectSectionProps) => {
    const { getContractInfo } = useContractStore();
    const isMobile = useMobile();
    const endpoint = useEndpoint();

    const contractInfo = getContractInfo(contractAddress);
    const {
      watch,
      reset,
      formState: { defaultValues },
    } = useForm({
      defaultValues: {
        isValid: false,
        instantiator: "",
        label: "",
        created: new Date(0),
      },
      mode: "all",
    });

    const { refetch } = useQuery(
      ["query", "instantiateInfo", contractAddress],
      async () => queryInstantiateInfo(endpoint, contractAddress),
      {
        enabled: false,
        retry: 0,
        onSuccess(data) {
          reset({
            isValid: true,
            instantiator: data.instantiator,
            label: data.label,
            created: data.createdTime,
          });
        },
        onError() {
          reset(defaultValues);
        },
      }
    );

    useEffect(() => {
      (async () => {
        if (!contractInfo) {
          refetch();
        } else {
          reset({
            isValid: true,
            instantiator: contractInfo.instantiator,
            label: contractInfo.label,
            created: contractInfo.created,
          });
        }
      })();
    }, [contractAddress, contractInfo, endpoint, reset, refetch]);

    const contractState = watch();
    const notSelected = contractAddress.length === 0;
    return (
      <Flex
        mb="32px"
        borderWidth="thin"
        borderColor="gray.800"
        p="16px"
        borderRadius="4px"
        fontSize="12px"
        justify="space-between"
        align="center"
      >
        <Flex gap="24px" width="70%">
          <Flex direction="column" width="70%">
            Contract Address
            {!notSelected ? (
              <ExplorerLink
                value={contractAddress}
                type="contract_address"
                canCopyWithHover
                // TODO - Revisit not necessary if disable UI for mobile is implemented
                textFormat={isMobile ? "truncate" : "normal"}
                maxWidth="none"
              />
            ) : (
              <Text textColor="text.disabled" variant="body2">
                Not Selected
              </Text>
            )}
          </Flex>
          <Flex direction="column" width="calc(30% - 24px)">
            Contract Name
            <DisplayName
              notSelected={notSelected}
              isValid={contractState.isValid}
              name={contractInfo?.name}
              label={contractState.label}
            />
          </Flex>
        </Flex>

        <Flex gap="8px">
          {contractState.isValid && (
            <ContractDetailsButton
              contractAddress={contractAddress}
              contractInfo={contractInfo}
              instantiator={contractState.instantiator}
              label={contractState.label}
              created={contractState.created}
            />
          )}
          <SelectContract
            notSelected={notSelected}
            onContractSelect={onContractSelect}
          />
        </Flex>
      </Flex>
    );
  }
);
