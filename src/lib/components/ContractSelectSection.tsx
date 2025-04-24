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
  isValid: boolean;
  label: string;
  name?: string;
  notSelected: boolean;
}

interface ContractDetailsButtonProps {
  contractAddress: BechAddr32;
  contractLocalInfo: Option<ContractLocalInfo>;
  instantiator: BechAddr;
  label: string;
}

interface ContractSelectSectionProps {
  contractAddress: BechAddr32;
  mode: "all-lists" | "only-admin";
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
  isValid,
  label,
  name,
  notSelected,
}: DisplayNameProps) => {
  const displayName = useMemo(() => {
    if (notSelected) return "Not selected";
    if (!isValid) return "Invalid contract";
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
          Add to list
        </Button>
      }
    />
  );
};

export const ContractSelectSection = observer(
  ({
    contractAddress,
    mode,
    onContractSelect,
    successCallback,
  }: ContractSelectSectionProps) => {
    const isMobile = useMobile();
    const { getContractLocalInfo } = useContractStore();
    const [codeId, setCodeId] = useState<number>();
    const [codeHash, setCodeHash] = useState<string>();

    const contractLocalInfo = getContractLocalInfo(contractAddress);
    const {
      formState: { defaultValues },
      reset,
      watch,
    } = useForm({
      defaultValues: {
        instantiator: "",
        isValid: false,
        label: "",
      },
      mode: "all",
    });

    const { isFetching, refetch } = useContractData(contractAddress, {
      enabled: !!contractAddress,
      onError: () => reset(defaultValues),
      onSuccess: (data) => {
        successCallback?.(data);
        reset({
          instantiator: data.contract.instantiator,
          isValid: true,
          label: data.contract.label,
        });

        setCodeId(data.contract.codeId);
        setCodeHash(data.contract.codeHash);
      },
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
          instantiator: contractLocalInfo.instantiator,
          isValid: true,
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
              Contract address
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
                  Not selected
                </Text>
              )}
            </Flex>
            <Flex
              direction="column"
              width={{ base: "auto", md: style.contractNameContainer }}
            >
              Contract name
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
