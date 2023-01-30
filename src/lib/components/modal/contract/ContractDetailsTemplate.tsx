import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { OffChainForm } from "lib/components/OffChainForm";
import { DEFAULT_LIST } from "lib/data";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";
import { getDescriptionDefault, getTagsDefault } from "lib/utils";

interface ContractDetailsTemplateProps {
  title: string;
  subtitle?: string;
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}
export const ContractDetailsTemplate = ({
  title,
  subtitle,
  contractLocalInfo,
  triggerElement,
}: ContractDetailsTemplateProps) => {
  const defaultValues = useMemo(() => {
    return {
      name: contractLocalInfo.name ?? "",
      description: getDescriptionDefault(contractLocalInfo.description),
      tags: getTagsDefault(contractLocalInfo.tags),
      lists: contractLocalInfo.lists ?? DEFAULT_LIST,
    };
  }, [
    contractLocalInfo.description,
    contractLocalInfo.lists,
    contractLocalInfo.name,
    contractLocalInfo.tags,
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
  }, [defaultValues, resetForm]);

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
          <Text variant="body2" color="text.main" fontWeight="600">
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
    >
      <OffChainForm<OffchainDetail>
        state={offchainState}
        control={control}
        setTagsValue={setTagsValue}
        setContractListsValue={setContractListsValue}
        errors={errors}
        labelBgColor="gray.800"
      />
    </ActionModal>
  );
};
