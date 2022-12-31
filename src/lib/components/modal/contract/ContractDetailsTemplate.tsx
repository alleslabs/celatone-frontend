import { Flex, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { OffChainForm } from "lib/components/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

interface ContractDetailsTemplateProps {
  title: string;
  subtitle?: string;
  contractInfo: ContractInfo;
  triggerElement: JSX.Element;
}
export const ContractDetailsTemplate = ({
  title,
  subtitle,
  contractInfo,
  triggerElement,
}: ContractDetailsTemplateProps) => {
  const {
    control,
    setValue,
    watch,
    reset,
    formState: { errors, defaultValues },
  } = useForm<OffchainDetail>({
    defaultValues: {
      name: contractInfo.name ?? "",
      description: contractInfo.description ?? "",
      tags: contractInfo.tags ?? [],
      lists: contractInfo.lists ?? [],
    },
    mode: "all",
  });

  const resetForm = () => reset(defaultValues);

  const offchainState: OffchainDetail = {
    name: watch("name"),
    description: watch("description"),
    tags: watch("tags"),
    lists: watch("lists"),
  };
  const setTagsValue = (selectedTags: string[]) => {
    setValue("tags", selectedTags);
  };
  const setContractListsValue = (selectedLists: Option[]) => {
    setValue("lists", selectedLists);
  };

  const handleSave = useHandleContractSave({
    title: "Action Complete",
    contractAddress: contractInfo.contractAddress,
    instantiator: contractInfo.instantiator,
    label: contractInfo.label,
    created: contractInfo.created,
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
            value={contractInfo.contractAddress}
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
