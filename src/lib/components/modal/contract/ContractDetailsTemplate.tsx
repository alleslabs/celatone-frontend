/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { OffChainForm } from "lib/components/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";
import { getNameAndDescriptionDefault, getTagsDefault } from "lib/utils";

interface ContractDetailsTemplateModalProps {
  title: string;
  subtitle?: string;
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
  defaultList?: LVPair[];
  isSave?: boolean;
}
export const ContractDetailsTemplateModal = ({
  title,
  subtitle,
  contractLocalInfo,
  triggerElement,
  defaultList = [],
  isSave = false,
}: ContractDetailsTemplateModalProps) => {
  const defaultValues = useMemo(() => {
    return {
      name: contractLocalInfo.name ?? "",
      description: getNameAndDescriptionDefault(contractLocalInfo.description),
      tags: getTagsDefault(contractLocalInfo.tags),
      lists: contractLocalInfo.lists ?? defaultList,
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
    setValue,
    watch,
    reset,
    formState: { errors },
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
    title: "Action Complete!",
    contractAddress: contractLocalInfo.contractAddress,
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
    name: offchainState.name,
    description: offchainState.description,
    tags: offchainState.tags,
    lists: offchainState.lists,
    actions: () =>
      AmpTrack(isSave ? AmpEvent.CONTRACT_SAVE : AmpEvent.CONTRACT_EDIT),
  });

  return (
    <ActionModal
      title={title}
      subtitle={subtitle}
      headerContent={
        <Flex gap={4} alignItems="center" pt="6">
          <Text variant="body2" fontWeight="600">
            Contract Address
          </Text>
          <ExplorerLink
            value={contractLocalInfo.contractAddress}
            type="contract_address"
          />
        </Flex>
      }
      trigger={triggerElement}
      mainBtnTitle="Save"
      mainAction={handleSave}
      disabledMain={!!errors.name || !!errors.description}
      otherBtnTitle="Cancel"
      otherAction={resetForm}
      closeOnOverlayClick={false}
    >
      <OffChainForm<OffchainDetail>
        state={offchainState}
        contractLabel={contractLocalInfo.label}
        control={control}
        setTagsValue={setTagsValue}
        setContractListsValue={setContractListsValue}
        errors={errors}
        labelBgColor="gray.900"
      />
    </ActionModal>
  );
};
