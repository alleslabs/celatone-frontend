import type { ContractData } from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { BechAddr, BechAddr32, Option } from "lib/types";

import { Button, Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { useContractStore } from "lib/providers/store";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useContractData } from "lib/services/wasm/contract";
import { getWasmVerifyStatus } from "lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";
import { LoadingOverlay } from "./LoadingOverlay";
import { EditContractDetailsModal, SaveContractDetailsModal } from "./modal";
import {
  SelectContractAdmin,
  SelectContractInstantiator,
} from "./select-contract";
import { WasmVerifyBadge } from "./WasmVerifyBadge";

interface DisplayNameProps {
  notSelected: boolean;
  isValid: boolean;
  name?: string;
  label: string;
}

interface ContractDetailsButtonProps {
  contractAddress: BechAddr32;
  contractLocalInfo: Option<ContractLocalInfo>;
  instantiator: BechAddr;
  label: string;
}

interface ContractSelectSectionProps {
  mode: "all-lists" | "only-admin";
  contractAddress: BechAddr32;
  onContractSelect: (contract: BechAddr32) => void;
  successCallback?: (data: ContractData) => void;
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
        contractAddrContainer: "30%",
        contractAddrW: "180px",
        contractNameContainer: "70%",
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
  const isMobile = useMobile();
  const isExist = !!contractLocalInfo?.lists;
  if (isMobile) return null;
  return isExist ? (
    <EditContractDetailsModal
      contractLocalInfo={contractLocalInfo}
      triggerElement={
        <Button
          float="right"
          leftIcon={<CustomIcon name="edit" />}
          size="sm"
          variant="ghost-gray"
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
          float="right"
          leftIcon={<CustomIcon boxSize="12px" name="bookmark" />}
          size="sm"
          variant="outline-gray"
        >
          Add To List
        </Button>
      }
    />
  );
};

export const ContractSelectSection = observer(
  ({
    mode,
    contractAddress,
    onContractSelect,
    successCallback,
  }: ContractSelectSectionProps) => {
    const isMobile = useMobile();
    const { getContractLocalInfo } = useContractStore();
    const [codeId, setCodeId] = useState<number>();
    const [codeHash, setCodeHash] = useState<string>();

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

    const { refetch, isFetching } = useContractData(contractAddress, {
      enabled: !!contractAddress,
      onSuccess: (data) => {
        successCallback?.(data);
        reset({
          isValid: true,
          instantiator: data.contract.instantiator,
          label: data.contract.label,
        });

        setCodeId(data.contract.codeId);
        setCodeHash(data.contract.codeHash);
      },
      onError: () => reset(defaultValues),
    });

    const {
      data: derivedWasmVerifyInfo,
      isLoading: isDerivedWasmVerifyInfoLoading,
    } = useDerivedWasmVerifyInfo(codeId, codeHash);

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
    }, [contractAddress, contractLocalInfo, reset, refetch]);

    const contractState = watch();
    const notSelected = contractAddress.length === 0;
    const style = modeStyle(mode);

    return (
      <>
        {(isFetching || isDerivedWasmVerifyInfoLoading) && <LoadingOverlay />}
        <Flex
          align="center"
          borderColor="gray.800"
          borderRadius="8px"
          borderWidth="thin"
          fontSize="12px"
          justify="space-between"
          mb={style.container}
          p={4}
          width="full"
        >
          <Flex direction={{ base: "column", md: "row" }} gap={4} width="100%">
            <Flex
              direction="column"
              width={{ base: "auto", md: style.contractAddrContainer }}
            >
              Contract Address
              {!notSelected ? (
                <ExplorerLink
                  maxWidth="none"
                  minWidth={style.contractAddrW}
                  rightIcon={
                    <WasmVerifyBadge
                      linkedCodeId={codeId}
                      relatedVerifiedCodes={
                        derivedWasmVerifyInfo?.relatedVerifiedCodes
                      }
                      status={getWasmVerifyStatus(derivedWasmVerifyInfo)}
                    />
                  }
                  showCopyOnHover
                  // TODO - Revisit not necessary if disable UI for mobile is implemented
                  textFormat={
                    isMobile || mode === "only-admin" ? "truncate" : "normal"
                  }
                  type="contract_address"
                  value={contractAddress}
                  wordBreak="break-all"
                />
              ) : (
                <Text color="text.disabled" variant="body2">
                  Not Selected
                </Text>
              )}
            </Flex>
            <Flex
              direction="column"
              width={{ base: "auto", md: style.contractNameContainer }}
            >
              Contract Name
              <DisplayName
                isValid={contractState.isValid}
                label={contractState.label}
                name={contractLocalInfo?.name}
                notSelected={notSelected}
              />
            </Flex>
            <Flex alignItems="center" gap={2}>
              {mode === "all-lists" && contractState.isValid && (
                <ContractDetailsButton
                  contractAddress={contractAddress}
                  contractLocalInfo={contractLocalInfo}
                  instantiator={contractState.instantiator as BechAddr}
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
      </>
    );
  }
);
