import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Flex, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/offchain/OffChainForm";
import { OffChainForm } from "lib/components/offchain/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

interface ModalProps {
  contractInfo: ContractInfo;
  menuItemProps: MenuItemProps;
}
export const EditContract = ({ contractInfo, menuItemProps }: ModalProps) => {
  const defaultValues: OffchainDetail = {
    name: contractInfo.name ?? "",
    description: contractInfo.description ?? "",
    tags: contractInfo.tags ?? [],
    lists: contractInfo.lists ?? [],
  };

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

  const resetForm = () => reset(defaultValues);

  const offchainState: OffchainDetail = {
    name: watch("name"),
    description: watch("description"),
    tags: watch("tags"),
    lists: watch("lists"),
  };
  const setTagsValue = (selectedOptions: string[]) => {
    setValue("tags", selectedOptions);
  };
  const setContractListsValue = (selectedOptions: Option[]) => {
    setValue("lists", selectedOptions);
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
      title="Edit Contract Details"
      subtitle="Filled information below will be saved on Celatone only and able
              to edit later."
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
      trigger={<MenuItem {...menuItemProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      disabledMain={!!errors.name || !!errors.description}
      otherBtnTitle="Cancel"
      otherAction={resetForm}
    >
      <OffChainForm
        nameField="name"
        descriptionField="description"
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
