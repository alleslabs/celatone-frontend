import { Button, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { useCelatoneApp } from "lib/app-provider";
import { useContractStore, useLCDEndpoint, useMobile } from "lib/hooks";
import { queryInstantiateInfo } from "lib/services/contract";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { Addr, ContractAddr, Option } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon/CustomIcon";
import { EditContractDetailsModal, SaveContractDetailsModal } from "./modal";
import {
  SelectContractAdmin,
  SelectContractInstantiator,
} from "./modal/select-contract";

interface DisplayNameProps {
  notSelected: boolean;
  isValid: boolean;
  name?: string;
  label: string;
}

interface ContractDetailsButtonProps {
  contractAddress: ContractAddr;
  contractLocalInfo: Option<ContractLocalInfo>;
  instantiator: Addr;
  label: string;
}

interface ContractSelectSectionProps {
  mode: "all-lists" | "only-admin";
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
  contractLocalInfo,
  instantiator,
  label,
}: ContractDetailsButtonProps) => {
  const isExist = !!contractLocalInfo?.lists;
  return isExist ? (
    <EditContractDetailsModal
      contractLocalInfo={contractLocalInfo}
      triggerElement={
        <Button
          variant="ghost-gray"
          float="right"
          leftIcon={<CustomIcon name="edit" color="text.dark" />}
        >
          Edit
        </Button>
      }
    />
  ) : (
    <SaveContractDetailsModal
      contractLocalInfo={{
        contractAddress,
        instantiator,
        label,
        ...contractLocalInfo,
      }}
      triggerElement={
        <Button
          variant="outline-gray"
          float="right"
          leftIcon={<CustomIcon name="bookmark" color="text.dark" />}
        >
          Add To List
        </Button>
      }
    />
  );
};

export const ContractSelectSection = observer(
  ({ mode, contractAddress, onContractSelect }: ContractSelectSectionProps) => {
    const { getContractLocalInfo } = useContractStore();
    const { indexerGraphClient } = useCelatoneApp();
    const isMobile = useMobile();
    const endpoint = useLCDEndpoint();

    const contractLocalInfo = getContractLocalInfo(contractAddress);
    const {
      watch,
      reset,
      formState: { defaultValues },
    } = useForm({
      defaultValues: {
        isValid: false,
        instantiator: "",
        label: "",
      },
      mode: "all",
    });

    const { refetch } = useQuery(
      [
        "query",
        "instantiate_info",
        endpoint,
        indexerGraphClient,
        contractAddress,
      ],
      async () =>
        queryInstantiateInfo(endpoint, indexerGraphClient, contractAddress),
      {
        enabled: false,
        retry: false,
        onSuccess(data) {
          reset({
            isValid: true,
            instantiator: data.instantiator,
            label: data.label,
          });
        },
        onError() {
          reset(defaultValues);
        },
      }
    );

    useEffect(() => {
      if (!contractLocalInfo) {
        if (contractAddress) refetch();
      } else {
        reset({
          isValid: true,
          instantiator: contractLocalInfo.instantiator,
          label: contractLocalInfo.label,
        });
      }
    }, [contractAddress, contractLocalInfo, endpoint, reset, refetch]);

    const contractState = watch();
    const notSelected = contractAddress.length === 0;
    return (
      <Flex
        borderWidth="thin"
        borderColor="pebble.800"
        p="16px"
        borderRadius="8px"
        fontSize="12px"
        justify="space-between"
        align="center"
        width="full"
      >
        <Flex gap="24px" width={mode === "all-lists" ? "70%" : "60%"}>
          <Flex direction="column" width={mode === "all-lists" ? "70%" : "40%"}>
            Contract Address
            {!notSelected ? (
              <ExplorerLink
                value={contractAddress}
                type="contract_address"
                canCopyWithHover
                // TODO - Revisit not necessary if disable UI for mobile is implemented
                textFormat={
                  isMobile || mode === "only-admin" ? "truncate" : "normal"
                }
                maxWidth="none"
              />
            ) : (
              <Text color="text.disabled" variant="body2">
                Not Selected
              </Text>
            )}
          </Flex>
          <Flex
            direction="column"
            width={
              mode === "all-lists" ? "calc(30% - 24px)" : "calc(60% - 24px)"
            }
          >
            Contract Name
            <DisplayName
              notSelected={notSelected}
              isValid={contractState.isValid}
              name={contractLocalInfo?.name}
              label={contractState.label}
            />
          </Flex>
        </Flex>

        <Flex gap="8px">
          {mode === "all-lists" && contractState.isValid && (
            <ContractDetailsButton
              contractAddress={contractAddress}
              contractLocalInfo={contractLocalInfo}
              instantiator={contractState.instantiator as Addr}
              label={contractState.label}
            />
          )}
          {mode === "all-lists" ? (
            <SelectContractInstantiator
              notSelected={notSelected}
              onContractSelect={onContractSelect}
            />
          ) : (
            <SelectContractAdmin
              notSelected={notSelected}
              onContractSelect={onContractSelect}
            />
          )}
        </Flex>
      </Flex>
    );
  }
);
