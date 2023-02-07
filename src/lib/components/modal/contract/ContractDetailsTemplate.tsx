import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { OffChainForm } from "lib/components/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";
import { getDescriptionDefault, getTagsDefault } from "lib/utils";

interface ContractDetailsTemplateModalProps {
  title: string;
  subtitle?: string;
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
  defaultList?: LVPair[];
}
export const ContractDetailsTemplateModal = ({
  title,
  subtitle,
  contractLocalInfo,
  triggerElement,
  defaultList = [],
}: ContractDetailsTemplateModalProps) => {
  const defaultValues = useMemo(() => {
    return {
      name: contractLocalInfo.name ?? "",
      description: getDescriptionDefault(contractLocalInfo.description),
      tags: getTagsDefault(contractLocalInfo.tags),
      lists: contractLocalInfo.lists ?? defaultList,
    };
  }, [
    contractLocalInfo.description,
    contractLocalInfo.lists,
    contractLocalInfo.name,
    contractLocalInfo.tags,
    defaultList,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(defaultValues), reset]
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
        labelBgColor="pebble.900"
      />
    </ActionModal>
  );
};
