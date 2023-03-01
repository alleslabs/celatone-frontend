import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { MdMode, MdOutlineBookmarkBorder } from "react-icons/md";

import { useCelatoneApp, useLCDEndpoint, useMobile } from "lib/app-provider";
import { useContractStore } from "lib/providers/store";
import { queryInstantiateInfo } from "lib/services/contract";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { Addr, ContractAddr, Option } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { EditContractDetailsModal, SaveContractDetailsModal } from "./modal";
import {
  SelectContractAdmin,
  SelectContractInstantiator,
} from "./select-contract";

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

const modeStyle = (mode: string) => {
  switch (mode) {
    case "all-lists":
      return {
        container: "0px",
        contractAddrContainer: "70%",
        contractAddrW: "auto",
        contractNameContainer: "30%",
      };
    case "only-admin":
      return {
        container: "12",
        contractAddrContainer: "40%",
        contractAddrW: "144px",
        contractNameContainer: "60%",
      };
    default:
      return {
        container: "12",
        contractAddrContainer: "40%",
        contractAddrW: "auto",
        contractNameContainer: "60%",
      };
  }
};

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
          size="sm"
          leftIcon={<Icon as={MdMode} boxSize="5" />}
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
          size="sm"
          leftIcon={<Icon as={MdOutlineBookmarkBorder} boxSize="5" />}
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
    const style = modeStyle(mode);

    return (
      <Flex
        mb={style.container}
        borderWidth="thin"
        borderColor="pebble.800"
        p="16px"
        borderRadius="8px"
        fontSize="12px"
        justify="space-between"
        align="center"
        width="full"
      >
        <Flex gap={4} width="100%">
          <Flex direction="column" width={style.contractAddrContainer}>
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
                minWidth={style.contractAddrW}
                wordBreak="break-all"
              />
            ) : (
              <Text color="text.disabled" variant="body2">
                Not Selected
              </Text>
            )}
          </Flex>
          <Flex direction="column" width={style.contractNameContainer}>
            Contract Name
            <DisplayName
              notSelected={notSelected}
              isValid={contractState.isValid}
              name={contractLocalInfo?.name}
              label={contractState.label}
            />
          </Flex>
          <Flex gap="8px" alignItems="center">
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
      </Flex>
    );
  }
);
