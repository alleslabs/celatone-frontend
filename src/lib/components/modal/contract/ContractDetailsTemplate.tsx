/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { IconKeys } from "lib/components/icon";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { OffChainForm } from "lib/components/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";
import { getNameAndDescriptionDefault, getTagsDefault } from "lib/utils";

interface ContractDetailsTemplateModalProps {
  contractLocalInfo: ContractLocalInfo;
  defaultList?: LVPair[];
  icon?: IconKeys;
  isSave?: boolean;
  subtitle?: string;
  title: string;
  triggerElement: JSX.Element;
}
export const ContractDetailsTemplateModal = ({
  contractLocalInfo,
  defaultList = [],
  icon = "edit",
  isSave = false,
  subtitle,
  title,
  triggerElement,
}: ContractDetailsTemplateModalProps) => {
  const defaultValues = useMemo(() => {
    return {
      description: getNameAndDescriptionDefault(contractLocalInfo.description),
      lists: contractLocalInfo.lists ?? defaultList,
      name: contractLocalInfo.name ?? "",
      tags: getTagsDefault(contractLocalInfo.tags),
    };
  }, [
    contractLocalInfo.description,
    JSON.stringify(contractLocalInfo.lists),
    contractLocalInfo.name,
    contractLocalInfo.tags,
    JSON.stringify(defaultList),
  ]);

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<OffchainDetail>({
    defaultValues,
    mode: "all",
  });

  const resetForm = useCallback(
    () => reset(defaultValues),
    [defaultValues, reset]
  );

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const offchainState = watch();

  const setTagsValue = (selectedTags: string[]) => {
    setValue("tags", selectedTags);
  };
  const setContractListsValue = (selectedLists: LVPair[]) => {
    setValue("lists", selectedLists);
  };

  const handleSave = useHandleContractSave({
    actions: () =>
      track(isSave ? AmpEvent.CONTRACT_SAVE : AmpEvent.CONTRACT_EDIT),
    codeId: contractLocalInfo.codeId,
    contractAddress: contractLocalInfo.contractAddress,
    description: offchainState.description,
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
    lists: offchainState.lists,
    name: offchainState.name,
    tags: offchainState.tags,
    title: "Action Complete!",
  });

  return (
    <ActionModal
      disabledMain={!!errors.name || !!errors.description}
      mainBtnTitle="Save"
      subtitle={subtitle}
      title={title}
      trigger={triggerElement}
      closeOnOverlayClick={false}
      headerContent={
        <Flex alignItems="center" gap={4} pt={6}>
          <Text variant="body2" color="text.dark" fontWeight={500}>
            Contract Address
          </Text>
          <ExplorerLink
            type="contract_address"
            value={contractLocalInfo.contractAddress}
          />
        </Flex>
      }
      icon={icon}
      mainAction={handleSave}
      otherAction={resetForm}
      otherBtnTitle="Cancel"
    >
      <OffChainForm<OffchainDetail>
        setTagsValue={setTagsValue}
        state={offchainState}
        contractLabel={contractLocalInfo.label}
        control={control}
        errors={errors}
        labelBgColor="gray.900"
        setContractListsValue={setContractListsValue}
      />
    </ActionModal>
  );
};
