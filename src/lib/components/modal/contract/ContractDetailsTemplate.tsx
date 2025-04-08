/* eslint-disable react-hooks/exhaustive-deps */
import type { IconKeys } from "lib/components/icon";
import type { OffchainDetail } from "lib/components/OffChainForm";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ActionModal } from "lib/components/modal/ActionModal";
import { OffChainForm } from "lib/components/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { getNameAndDescriptionDefault, getTagsDefault } from "lib/utils";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

interface ContractDetailsTemplateModalProps {
  title: string;
  subtitle?: string;
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
  defaultList?: LVPair[];
  isSave?: boolean;
  icon?: IconKeys;
}
export const ContractDetailsTemplateModal = ({
  title,
  subtitle,
  icon = "edit",
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
    title: "Action complete!",
    contractAddress: contractLocalInfo.contractAddress,
    label: contractLocalInfo.label,
    codeId: contractLocalInfo.codeId,
    instantiator: contractLocalInfo.instantiator,
    name: offchainState.name,
    description: offchainState.description,
    tags: offchainState.tags,
    lists: offchainState.lists,
    actions: () =>
      track(isSave ? AmpEvent.CONTRACT_SAVE : AmpEvent.CONTRACT_EDIT),
  });

  return (
    <ActionModal
      closeOnOverlayClick={false}
      disabledMain={!!errors.name || !!errors.description}
      headerContent={
        <Flex gap={4} alignItems="center" pt={6}>
          <Text variant="body2" fontWeight={500} color="text.dark">
            Contract address
          </Text>
          <ExplorerLink
            type="contract_address"
            value={contractLocalInfo.contractAddress}
          />
        </Flex>
      }
      icon={icon}
      mainAction={handleSave}
      mainBtnTitle="Save"
      otherAction={resetForm}
      otherBtnTitle="Cancel"
      subtitle={subtitle}
      title={title}
      trigger={triggerElement}
    >
      <OffChainForm<OffchainDetail>
        contractLabel={contractLocalInfo.label}
        control={control}
        errors={errors}
        labelBgColor="gray.900"
        setContractListsValue={setContractListsValue}
        setTagsValue={setTagsValue}
        state={offchainState}
      />
    </ActionModal>
  );
};
